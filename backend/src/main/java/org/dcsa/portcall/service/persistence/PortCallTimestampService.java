package org.dcsa.portcall.service.persistence;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.dcsa.portcall.controller.PortCallException;
import org.dcsa.portcall.db.tables.pojos.Port;
import org.dcsa.portcall.db.tables.pojos.PortCallTimestamp;
import org.dcsa.portcall.db.tables.pojos.Vessel;
import org.dcsa.portcall.message.EventClassifierCode;
import org.dcsa.portcall.util.PortcallTimestampTypeMapping;
import org.dcsa.portcall.util.TimeZoneConverter;
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
import java.util.List;

import static org.dcsa.portcall.db.tables.PortCallTimestamp.PORT_CALL_TIMESTAMP;

@Service
public class PortCallTimestampService extends AbstractPersistenceService {

    private static final Logger log = LogManager.getLogger(PortCallTimestampService.class);

    private final PortService portService;
    private final VesselService vesselService;

    public PortCallTimestampService(DSLContext dsl, PortService portService, VesselService vesselService) {
        super(dsl);
        this.portService = portService;
        this.vesselService = vesselService;
    }

    @Transactional(readOnly = true)
    public List<PortCallTimestamp> findTimestampsById(final int vesselId) {
        Result<Record> timestamps = dsl.select()
                .from(PORT_CALL_TIMESTAMP)
                .where(PORT_CALL_TIMESTAMP.VESSEL.eq(vesselId)
                        .and(PORT_CALL_TIMESTAMP.DELETED.eq(false)))
                .fetch();

        return timestamps.into(PortCallTimestamp.class);
    }

    @Transactional(readOnly = true)
    public List<PortCallTimestamp> findTimestamps() {
        Result<Record> timestamps = dsl.select()
                .from(PORT_CALL_TIMESTAMP)
                .where(PORT_CALL_TIMESTAMP.DELETED.eq(false))
                .fetch();
        return timestamps.into(PortCallTimestamp.class);
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
    public void addTimestamp(PortCallTimestamp portCallTimestamp) {
        // Calculate received UTC Timestamp to Time Zone of PotOfCall for event TimeStamp
        Port portOfCall = portService.findPortById(portCallTimestamp.getPortOfCall()).get();

        OffsetDateTime eventTimeStampAtPoc = TimeZoneConverter.convertToTimezone(
                portCallTimestamp.getEventTimestamp(), portOfCall);

        // Calculate received UTC Timestamp to Time Zone of PotOfCall for Log of TimeStamp
        OffsetDateTime logOfTimeStampAtPoc = TimeZoneConverter.convertToTimezone(
                portCallTimestamp.getLogOfTimestamp(), portOfCall);

        log.info("Set timezone for event timestamp [{}}] and log of timestamp [{}}]", eventTimeStampAtPoc, logOfTimeStampAtPoc);
        List<PortCallTimestamp> timestampsOfVessel = findTimestampsById(portCallTimestamp.getVessel());
        int seq = this.calculatePortCallSequence(timestampsOfVessel, portCallTimestamp);

        // Get Vessel
        Vessel vessel = vesselService.findVesselById(portCallTimestamp.getVessel()).get();

        try {
            Record1<Integer> id =
                    dsl.insertInto(PORT_CALL_TIMESTAMP, PORT_CALL_TIMESTAMP.VESSEL,
                            PORT_CALL_TIMESTAMP.PORT_OF_CALL, PORT_CALL_TIMESTAMP.PORT_PREVIOUS, PORT_CALL_TIMESTAMP.PORT_NEXT,
                            PORT_CALL_TIMESTAMP.TIMESTAMP_TYPE, PORT_CALL_TIMESTAMP.EVENT_TIMESTAMP, PORT_CALL_TIMESTAMP.LOG_OF_TIMESTAMP,
                            PORT_CALL_TIMESTAMP.DIRECTION, PORT_CALL_TIMESTAMP.TERMINAL, PORT_CALL_TIMESTAMP.LOCATION_ID,
                            PORT_CALL_TIMESTAMP.CHANGE_COMMENT, PORT_CALL_TIMESTAMP.DELAY_CODE, PORT_CALL_TIMESTAMP.CALL_SEQUENCE, PORT_CALL_TIMESTAMP.VESSEL_SERVICE_NAME)
                            .values(portCallTimestamp.getVessel(),
                                    portCallTimestamp.getPortOfCall(), portCallTimestamp.getPortPrevious(), portCallTimestamp.getPortNext(),
                                    portCallTimestamp.getTimestampType(), eventTimeStampAtPoc, logOfTimeStampAtPoc,
                                    portCallTimestamp.getDirection(), portCallTimestamp.getTerminal(), portCallTimestamp.getLocationId(),
                                    portCallTimestamp.getChangeComment(), portCallTimestamp.getDelayCode(), seq, vessel.getServiceNameCode())
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
     * Method to calculate a sequence for timestamps:
     * A sequence always starts with an Estimated Classifier code (EST) and ans with an ACTUAL (ACT
     * a sequence is always based on the vessel, the location, and the port and terminals of timestamp
     */
    private int calculatePortCallSequence(List<PortCallTimestamp> timestamps, PortCallTimestamp newTimeStamp) {

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
    private PortCallTimestamp getLastTimestampForSequence(List<PortCallTimestamp> timestamps, PortCallTimestamp newTimestamp) {

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
    public int deletePortCallTimestamp(final int portCallTimestampId) {
        return dsl.update(PORT_CALL_TIMESTAMP)
                .set(PORT_CALL_TIMESTAMP.DELETED, true)
                .where(PORT_CALL_TIMESTAMP.ID.eq(portCallTimestampId))
                .execute();
    }
}
