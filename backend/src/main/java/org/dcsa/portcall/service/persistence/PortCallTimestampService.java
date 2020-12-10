package org.dcsa.portcall.service.persistence;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.dcsa.portcall.PortCallProperties;
import org.dcsa.portcall.controller.PortCallException;
import org.dcsa.portcall.db.enums.PortCallTimestampType;
import org.dcsa.portcall.db.tables.pojos.Port;
import org.dcsa.portcall.db.tables.pojos.PortCallTimestamp;
import org.dcsa.portcall.db.tables.pojos.Vessel;
import org.dcsa.portcall.message.EventClassifierCode;
import org.dcsa.portcall.model.PortCallTimestampExtended;
import org.dcsa.portcall.util.PortcallTimestampTypeMapping;
import org.dcsa.portcall.util.TimeZoneConverter;
import org.dcsa.portcall.util.TimestampResponseOptionMapping;
import org.jooq.DSLContext;
import org.jooq.Record;
import org.jooq.Record1;
import org.jooq.Result;
import org.jooq.impl.DSL;
import org.postgresql.util.PSQLException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.dcsa.portcall.db.tables.Message.MESSAGE;
import static org.dcsa.portcall.db.tables.PortCallTimestamp.PORT_CALL_TIMESTAMP;

@Service
public class PortCallTimestampService extends AbstractPersistenceService {

    private final Logger log = LogManager.getLogger(PortCallTimestampService.class);

    private final PortService portService;
    private final VesselService vesselService;
    private final PortCallProperties config;

    public PortCallTimestampService(DSLContext dsl, PortService portService, VesselService vesselService, PortCallProperties config) {
        super(dsl);
        this.portService = portService;
        this.vesselService = vesselService;
        this.config = config;
    }

    @Transactional(readOnly = true)
    public List<PortCallTimestampExtended> findTimestampsById(final int vesselId) {
        Result<Record> timestamps = dsl
                .select(PORT_CALL_TIMESTAMP.asterisk(),
                        MESSAGE.STATUS.as("MessagingStatus"),
                        MESSAGE.DETAIL.as("MessagingDetails"))
                .from(PORT_CALL_TIMESTAMP)
                .leftJoin(MESSAGE).on(MESSAGE.TIMESTAMP_ID.eq(PORT_CALL_TIMESTAMP.ID))
                .where(PORT_CALL_TIMESTAMP.VESSEL.eq(vesselId)
                        .and(PORT_CALL_TIMESTAMP.DELETED.eq(false)))
                .fetch();

        List<PortCallTimestampExtended> pcTimestamps = timestamps.into(PortCallTimestampExtended.class);
        this.identifyResponseOptions(pcTimestamps);
        return pcTimestamps;
    }

    @Transactional(readOnly = true)
    public List<PortCallTimestampExtended> findTimestamps() {
        Result<Record> timestamps = dsl
                .select(PORT_CALL_TIMESTAMP.asterisk(),
                        MESSAGE.STATUS.as("MessagingStatus"),
                        MESSAGE.DETAIL.as("MessagingDetails"))
                .from(PORT_CALL_TIMESTAMP)
                .leftJoin(MESSAGE).on(MESSAGE.TIMESTAMP_ID.eq(PORT_CALL_TIMESTAMP.ID))
                .where(PORT_CALL_TIMESTAMP.DELETED.eq(false))
                .fetch();
        List<PortCallTimestampExtended> pcTimestamps = timestamps.into(PortCallTimestampExtended.class);
        this.identifyResponseOptions(pcTimestamps);
        return pcTimestamps;
    }

    @Transactional(readOnly = true)
    public Integer getHighestTimestampId(final int vesselId) {
        Record1<Integer> highestIdRecord = dsl.select(DSL.max(PORT_CALL_TIMESTAMP.ID))
                .from(PORT_CALL_TIMESTAMP)
                .where(PORT_CALL_TIMESTAMP.VESSEL.eq(vesselId)
                        .and(PORT_CALL_TIMESTAMP.DELETED.eq(false)))
                .fetchOne();
        return highestIdRecord.value1();
    }

    @Transactional
    public void addTimestamp(PortCallTimestamp portCallTimestamp, Boolean transformTimezone) {
        // Calculate received UTC Timestamp to Time Zone of PotOfCall for event TimeStamp
        OffsetDateTime eventTimeStampAtPoc = portCallTimestamp.getEventTimestamp();
        OffsetDateTime logOfTimeStampAtPoc = portCallTimestamp.getLogOfTimestamp();

        if (transformTimezone) {
            Port portOfCall = portService.findPortById(portCallTimestamp.getPortOfCall()).get();

            eventTimeStampAtPoc = TimeZoneConverter.convertToTimezone(
                    portCallTimestamp.getEventTimestamp(), portOfCall);

            // Calculate received UTC Timestamp to Time Zone of PotOfCall for Log of TimeStamp
            logOfTimeStampAtPoc = TimeZoneConverter.convertToTimezone(
                    portCallTimestamp.getLogOfTimestamp(), portOfCall);

            // check if Timestamps are prior current time
            OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);
            if (logOfTimeStampAtPoc.isAfter(now)) {
                String msg = String.format("Log timestamp [%s] is in the future", logOfTimeStampAtPoc);
                log.error(msg);
                PortCallException portCallException = new PortCallException(HttpStatus.CONFLICT, msg);
                throw portCallException;
            }

        }
        log.info("Set timezone for event timestamp [{}}] and log of timestamp [{}}]", eventTimeStampAtPoc, logOfTimeStampAtPoc);
        List<PortCallTimestampExtended> timestampsOfVessel = findTimestampsById(portCallTimestamp.getVessel());
        int seq = this.calculatePortCallSequence(timestampsOfVessel, portCallTimestamp);

        // Get Vessel
        Vessel vessel = vesselService.findVesselById(portCallTimestamp.getVessel()).get();

        // Create a new process id or generate a new one
        portCallTimestamp.setProcessId(getOrGenerateProcessId(portCallTimestamp));

        try {
            Record1<Integer> id =
                    dsl.insertInto(PORT_CALL_TIMESTAMP, PORT_CALL_TIMESTAMP.VESSEL,
                            PORT_CALL_TIMESTAMP.PORT_OF_CALL, PORT_CALL_TIMESTAMP.PORT_PREVIOUS, PORT_CALL_TIMESTAMP.PORT_NEXT,
                            PORT_CALL_TIMESTAMP.TIMESTAMP_TYPE, PORT_CALL_TIMESTAMP.EVENT_TIMESTAMP, PORT_CALL_TIMESTAMP.LOG_OF_TIMESTAMP,
                            PORT_CALL_TIMESTAMP.DIRECTION, PORT_CALL_TIMESTAMP.TERMINAL, PORT_CALL_TIMESTAMP.LOCATION_ID,
                            PORT_CALL_TIMESTAMP.CHANGE_COMMENT, PORT_CALL_TIMESTAMP.DELAY_CODE, PORT_CALL_TIMESTAMP.CALL_SEQUENCE, PORT_CALL_TIMESTAMP.VESSEL_SERVICE_NAME,
                            PORT_CALL_TIMESTAMP.PROCESS_ID, PORT_CALL_TIMESTAMP.MODIFIABLE)
                            .values(portCallTimestamp.getVessel(),
                                    portCallTimestamp.getPortOfCall(), portCallTimestamp.getPortPrevious(), portCallTimestamp.getPortNext(),
                                    portCallTimestamp.getTimestampType(), eventTimeStampAtPoc, logOfTimeStampAtPoc,
                                    portCallTimestamp.getDirection(), portCallTimestamp.getTerminal(), portCallTimestamp.getLocationId(),
                                    portCallTimestamp.getChangeComment(), portCallTimestamp.getDelayCode(), seq, vessel.getServiceNameCode(),
                                    portCallTimestamp.getProcessId(), portCallTimestamp.getModifiable())
                            .returningResult(PORT_CALL_TIMESTAMP.ID)
                            .fetchOne();
            portCallTimestamp.setId(id.value1());
            log.info("Portcall Timestamp added with id [{}]", id.value1());
        } catch (Exception e) {
            String msg = String.format("Could not store port call timestamp: %s", e.getMessage());
            log.error(msg, e);

            PortCallException portCallException = new PortCallException(HttpStatus.CONFLICT, msg);
            if (e.getCause() instanceof PSQLException) {
                PSQLException cause = (PSQLException) e.getCause();
                portCallException.getErrorResponse().addErrors(cause.getServerErrorMessage().getMessage());
            }
            throw portCallException;
        }
    }

    /**
     * Function identifies if for that timestamp a response is enabled!
     */
    private void identifyResponseOptions(List<PortCallTimestampExtended> timestamps) {
        for (PortCallTimestampExtended timestamp : timestamps) {
            //ToDo Refactor
            int lastID = this.getHighestTimestampId(timestamp.getVessel());
            if (lastID == timestamp.getId()) {
                timestamp.setResponse(TimestampResponseOptionMapping.getResponseOption(this.config.getSenderRole(), timestamp));
            }


        }
    }


    public PortCallTimestampExtended acceptTimestamp(PortCallTimestampExtended originTimestamp) {
        log.info("Accepting original {} timestamp by sending a {}", originTimestamp.getTimestampType(), originTimestamp.getResponse());
        PortCallTimestampExtended timestamp = new PortCallTimestampExtended();
        timestamp.setModifiable(true);
        timestamp.setEventTimestamp(originTimestamp.getEventTimestamp());
        timestamp.setLogOfTimestamp(OffsetDateTime.now(ZoneOffset.UTC));
        timestamp.setVessel(originTimestamp.getVessel());
        timestamp.setVesselServiceName(originTimestamp.getVesselServiceName());
        timestamp.setPortPrevious(originTimestamp.getPortPrevious());
        timestamp.setPortNext(originTimestamp.getPortPrevious());
        timestamp.setPortOfCall(originTimestamp.getPortOfCall());
        timestamp.setDirection(originTimestamp.getDirection());
        timestamp.setTerminal(originTimestamp.getTerminal());
        timestamp.setLocationId(originTimestamp.getLocationId());
        timestamp.setTimestampType(originTimestamp.getResponse());

        if (timestamp.getTimestampType().equals(
                TimestampResponseOptionMapping.getResponseOption(this.config.getSenderRole(), originTimestamp))) {
            this.addTimestamp(timestamp, false);

        } else {
            String msg = String.format("As %s, you can not accept a %s with an %s", config.getSenderRole(), originTimestamp.getTimestampType(), timestamp.getTimestampType());
            log.error(msg);
            throw new PortCallException(HttpStatus.INTERNAL_SERVER_ERROR, msg);
        }


        return timestamp;

    }


    /**
     * Method to calculate a sequence for timestamps:
     * A sequence always starts with an Estimated Classifier code (EST) and ans with an ACTUAL (ACT
     * a sequence is always based on the vessel, the location, and the port and terminals of timestamp
     */
    private int calculatePortCallSequence(List<PortCallTimestampExtended> timestamps, PortCallTimestamp newTimeStamp) {

        int seq = 0;
        try {
            PortCallTimestamp lastTimestamp = this.getLastTimestampForSequence(timestamps, newTimeStamp);
            if (lastTimestamp != null) {
                seq = lastTimestamp.getCallSequence();
                EventClassifierCode lastClassType = PortcallTimestampTypeMapping.getEventClassifierCodeForTimeStamp(lastTimestamp.getTimestampType());
                if (lastClassType.equals(EventClassifierCode.REQ) || lastClassType.equals(EventClassifierCode.PLA)) {
                    if (PortcallTimestampTypeMapping.getEventClassifierCodeForTimeStamp(newTimeStamp.getTimestampType()).equals(EventClassifierCode.REQ) ||
                            PortcallTimestampTypeMapping.getEventClassifierCodeForTimeStamp(newTimeStamp.getTimestampType()).equals(EventClassifierCode.EST)) {
                        seq++;
                    }
                }

                // Reset to 0 if Classifiercode of last Timestamp ist ACT
                if (PortcallTimestampTypeMapping.getEventClassifierCodeForTimeStamp(lastTimestamp.getTimestampType()).equals(EventClassifierCode.ACT)) {
                    seq = 0;
                }

            }
        } catch (Exception e) {
            log.error("Error calculating sequence for new timestamp: " + e.getMessage(), e);
        }
        return seq;
    }

    /**
     * Returns the last TimeStamp of a Portcall Sequence (based on Ports and terminals, and Location)
     */

    private PortCallTimestamp getLastTimestampForSequence(List<PortCallTimestampExtended> timestamps, PortCallTimestamp newTimestamp) {
        //@ToDo Refactor this, as when the table of timestamps gets bigger, this function uses a lot of resources! e.g. Only pull timestmps from the last five days!
        PortCallTimestamp lastTimestamp = null;
        String hash = generateSequenceHash(newTimestamp);
        for (PortCallTimestamp timestamp : timestamps) {
            //only consider timestamps for same location and sequence Hash
            if (PortcallTimestampTypeMapping.getLocationCodeForTimeStampType(timestamp.getTimestampType()).equals(
                    PortcallTimestampTypeMapping.getLocationCodeForTimeStampType(newTimestamp.getTimestampType())
            ) &&
                    hash.equals(generateSequenceHash(timestamp))) {
                lastTimestamp = timestamp;
            }
        }
        return lastTimestamp;
    }

    /**
     * Makes an identifier for a Portcall from the used ports and terminals
     */
    private String generateSequenceHash(PortCallTimestamp timestamp) {
        return "" + timestamp.getPortPrevious()
                + timestamp.getPortOfCall()
                + timestamp.getPortNext()
                + timestamp.getTerminal();
    }


    @Transactional
    public int updatePortcallTimestampDelayCodeAndComment(final PortCallTimestamp portCallTimestamp) {
        return dsl.update(PORT_CALL_TIMESTAMP)
                .set(PORT_CALL_TIMESTAMP.DELAY_CODE, portCallTimestamp.getDelayCode())
                .set(PORT_CALL_TIMESTAMP.CHANGE_COMMENT, portCallTimestamp.getChangeComment())
                .where(PORT_CALL_TIMESTAMP.ID.eq(portCallTimestamp.getId()))
                .execute();
    }


    @Transactional
    public int updatePortcallTimestampProcessId(final PortCallTimestamp portCallTimestamp) {
        return dsl.update(PORT_CALL_TIMESTAMP)
                .set(PORT_CALL_TIMESTAMP.PROCESS_ID, portCallTimestamp.getProcessId())
                .where(PORT_CALL_TIMESTAMP.ID.eq(portCallTimestamp.getId()))
                .execute();
    }

    @Transactional
    public int deletePortCallTimestamp(final int portCallTimestampId) {
        return dsl.update(PORT_CALL_TIMESTAMP)
                .set(PORT_CALL_TIMESTAMP.DELETED, true)
                .where(PORT_CALL_TIMESTAMP.ID.eq(portCallTimestampId))
                .execute();
    }

    @Transactional
    public Optional<PortCallTimestamp> getTimeStampById(int timestampId) {
        Record rec = this.dsl.select()
                .from(PORT_CALL_TIMESTAMP)
                .where(PORT_CALL_TIMESTAMP.ID.eq(timestampId))
                .fetchOne();

        if (rec != null) {
            return Optional.of(rec.into(PortCallTimestamp.class));
        } else {
            return Optional.empty();
        }
    }

    @Transactional
    public String getOrGenerateProcessId(PortCallTimestamp timestamp) {
        Result<Record1<String>> previousProcessId = dsl.select(PORT_CALL_TIMESTAMP.PROCESS_ID)
                .from(PORT_CALL_TIMESTAMP)
                .where(PORT_CALL_TIMESTAMP.DELETED.isFalse()
                        .and(PORT_CALL_TIMESTAMP.VESSEL.eq(timestamp.getVessel()))
                        .and(PORT_CALL_TIMESTAMP.PORT_PREVIOUS.eq(timestamp.getPortPrevious()))
                        .and(PORT_CALL_TIMESTAMP.PORT_OF_CALL.eq(timestamp.getPortOfCall()))
                        .and(PORT_CALL_TIMESTAMP.PORT_NEXT.eq(timestamp.getPortNext()))
                        .and(PORT_CALL_TIMESTAMP.TERMINAL.eq(timestamp.getTerminal()))
                        .and(PORT_CALL_TIMESTAMP.EVENT_TIMESTAMP.ge(timestamp.getEventTimestamp().minusDays(14))))
                .orderBy(PORT_CALL_TIMESTAMP.EVENT_TIMESTAMP.desc(), PORT_CALL_TIMESTAMP.LOG_OF_TIMESTAMP.desc())
                .limit(1)
                .fetch();

        if (timestamp.getTimestampType() != PortCallTimestampType.ETA_Berth && previousProcessId.isNotEmpty()) {
            return previousProcessId.get(0).get(PORT_CALL_TIMESTAMP.PROCESS_ID);
        } else {
            return UUID.randomUUID().toString();
        }
    }
}
