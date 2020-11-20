/*
 * Copyright 2020 by PONTON GmbH,
 * Dorotheenstr. 64, 22301 Hamburg, Germany.
 * All rights reserved.
 *
 * This software is the confidential and proprietary information of
 * PONTON GmbH ("Confidential Information"). You shall not disclose
 * such Confidential Information and shall use it only in accordance with the
 * terms of the license agreement you entered into with PONTON GmbH.
 */
package org.dcsa.portcall.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.dcsa.portcall.PortCallProperties;
import org.dcsa.portcall.db.tables.pojos.PortCallTimestamp;
import org.dcsa.portcall.db.tables.pojos.Vessel;
import org.dcsa.portcall.message.EventClassifierCode;
import org.dcsa.portcall.service.PortCallMessageGeneratorService;
import org.dcsa.portcall.util.PortcallTimestampTypeMapping;
import org.dcsa.portcall.util.TimeZoneConverter;
import org.jooq.DSLContext;
import org.jooq.Record;
import org.jooq.Record1;
import org.jooq.Result;
import org.jooq.impl.DSL;
import org.postgresql.util.PSQLException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;

import static org.dcsa.portcall.db.tables.PortCallTimestamp.PORT_CALL_TIMESTAMP;

/**
 * <p>&copy; 2020 <a href="http://www.ponton.de" target="_blank">PONTON GmbH</a></p>
 */
@RestController
@RequestMapping("/portcalltimestamps")
public class PortCallTimestampController {
    private static final Logger log = LogManager.getLogger(PortCallTimestampController.class);
    private final DSLContext dsl;

    public PortCallTimestampController(DSLContext dsl) {
        this.dsl = dsl;
    }


    @GetMapping("/{vesselId}")
    @Transactional(readOnly = true)
    public List<PortCallTimestamp> listPortCallTimestamps(@PathVariable int vesselId) {
        log.info("Listing all port call timestamps for vessel {}", vesselId);
        Result<Record> timestamps = dsl.select()
                .from(PORT_CALL_TIMESTAMP)
                .where(PORT_CALL_TIMESTAMP.VESSEL.eq(vesselId)
                        .and(PORT_CALL_TIMESTAMP.DELETED.eq(false)))
                .fetch();

        if (timestamps == null) {
            String msg = String.format("No timestamps with vessel id %s found", vesselId);
            log.error(msg);
            throw new PortCallException(HttpStatus.NOT_FOUND, msg);
        } else {
            log.debug("Loaded timestamps with vessel id {}", vesselId);
            return timestamps.into(PortCallTimestamp.class);
        }
    }

    @GetMapping("/highestTimestampId/{vesselId}")
    @Transactional(readOnly = true)
    public Integer getHighestTimestampId(@PathVariable int vesselId) {
        log.info("Loading highest timestamp id of port call timestamps with vessel id {} ", vesselId);
        Record1<Integer> highestIdRecord = dsl.select(DSL.max(PORT_CALL_TIMESTAMP.ID))
                .from(PORT_CALL_TIMESTAMP)
                .where(PORT_CALL_TIMESTAMP.VESSEL.eq(vesselId)
                        .and(PORT_CALL_TIMESTAMP.DELETED.eq(false)))
                .fetchOne();
        return highestIdRecord.value1();
    }

    @PostMapping("/{vesselId}")
    @Transactional
    public PortCallTimestamp addPortCallTimestamp(@PathVariable int vesselId, @RequestBody PortCallTimestamp portCallTimestamp) {
        log.info("Add PortCall Timestamp requested for vessel id [{}]", vesselId);
        // Calculate received UTC Timestamp to Time Zone of PotOfCall for event TimeStamp
        OffsetDateTime eventTimeStampAtPoc =
                TimeZoneConverter.convertToTimezone(portCallTimestamp.getEventTimestamp(),
                        new PortController(this.dsl).getPortById(portCallTimestamp.getPortOfCall()));

        // Calculate received UTC Timestamp to Time Zone of PotOfCall for Log of TimeStamp
        OffsetDateTime logOfTimeStampAtPoc =
                TimeZoneConverter.convertToTimezone(portCallTimestamp.getLogOfTimestamp(),
                        new PortController(this.dsl).getPortById(portCallTimestamp.getPortOfCall()));
        log.info("Set timezone for event timestamp [{}}] and log of timestamp [{}}]", eventTimeStampAtPoc, logOfTimeStampAtPoc);

        List<PortCallTimestamp> timestampsOfVessel = listPortCallTimestamps(vesselId);
        int seq = this.calculatePortCallSequence(timestampsOfVessel, portCallTimestamp);

        // Get Vessel
        try {
            Vessel vessel = new VesselController(this.dsl).getVessel(vesselId);
            portCallTimestamp.setVessel(vesselId);
            Record1<Integer> id =
                    dsl.insertInto(PORT_CALL_TIMESTAMP, PORT_CALL_TIMESTAMP.VESSEL,
                            PORT_CALL_TIMESTAMP.PORT_OF_CALL, PORT_CALL_TIMESTAMP.PORT_PREVIOUS, PORT_CALL_TIMESTAMP.PORT_NEXT,
                            PORT_CALL_TIMESTAMP.TIMESTAMP_TYPE, PORT_CALL_TIMESTAMP.EVENT_TIMESTAMP, PORT_CALL_TIMESTAMP.LOG_OF_TIMESTAMP,
                            PORT_CALL_TIMESTAMP.DIRECTION, PORT_CALL_TIMESTAMP.TERMINAL, PORT_CALL_TIMESTAMP.LOCATION_ID,
                            PORT_CALL_TIMESTAMP.CHANGE_COMMENT, PORT_CALL_TIMESTAMP.DELAY_CODE, PORT_CALL_TIMESTAMP.CALL_SEQUENCE, PORT_CALL_TIMESTAMP.VESSEL_SERVICE_NAME)
                            .values(vesselId,
                                    portCallTimestamp.getPortOfCall(), portCallTimestamp.getPortPrevious(), portCallTimestamp.getPortNext(),
                                    portCallTimestamp.getTimestampType(), eventTimeStampAtPoc, logOfTimeStampAtPoc,
                                    portCallTimestamp.getDirection(), portCallTimestamp.getTerminal(), portCallTimestamp.getLocationId(),
                                    portCallTimestamp.getChangeComment(), portCallTimestamp.getDelayCode(), seq, vessel.getServiceNameCode())
                            .returningResult(PORT_CALL_TIMESTAMP.ID)
                            .fetchOne();
            portCallTimestamp.setId(id.value1());
            log.info("Portcall Timestamp added with id [{}]", id.value1());

            // Generate PortCall Message
            PortCallMessageGeneratorService pcMessageService = new PortCallMessageGeneratorService();
            pcMessageService.generate(portCallTimestamp, this.dsl);
            return portCallTimestamp;
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
     * Makes an identifier for a Portcall from the used ports and terminals
     */
    private String generateSequenceHash(PortCallTimestamp timestamp) {
        return "" + timestamp.getPortPrevious()
                + timestamp.getPortOfCall()
                + timestamp.getPortNext()
                + timestamp.getTerminal();
    }

    /**
     * Returns the last TimeStamp of a Portcall Sequence (based on Ports and terminals, and Location)
     */

    private PortCallTimestamp getLastTimestampForSequence(List<PortCallTimestamp> timestamps, PortCallTimestamp newTimestamp) {

        PortCallTimestamp lastTimestamp = null;
        String hash = this.generateSequenceHash(newTimestamp);
        for (PortCallTimestamp timestamp : timestamps) {
            //only consider timestamps for same location and sequence Hash
            if (PortcallTimestampTypeMapping.getLocationCodeForTimeStampType(timestamp.getTimestampType()).equals(
                    PortcallTimestampTypeMapping.getLocationCodeForTimeStampType(newTimestamp.getTimestampType())
            ) &&
                    hash.equals(this.generateSequenceHash(timestamp))) {
                lastTimestamp = timestamp;
            }
        }
        return lastTimestamp;
    }

    @PutMapping("/{portCallTimestampId}")
    @Transactional
    public void updatePortcallTimestampDelayCodeAndComment(@PathVariable int portCallTimestampId, @RequestBody PortCallTimestamp portCallTimestamp) {
        log.info("Updating port call timestamp with id {}", portCallTimestampId);
        int result = dsl.update(PORT_CALL_TIMESTAMP)
                .set(PORT_CALL_TIMESTAMP.DELAY_CODE, portCallTimestamp.getDelayCode())
                .set(PORT_CALL_TIMESTAMP.CHANGE_COMMENT, portCallTimestamp.getChangeComment())
                .where(PORT_CALL_TIMESTAMP.ID.eq(portCallTimestampId))
                .execute();
        if (result != 1) {
            String msg = String.format("Could not update port call timestamp with id %s", portCallTimestampId);
            log.error(msg);
            throw new PortCallException(HttpStatus.BAD_REQUEST, msg);
        } else {
            log.debug("Port call timestamp {} successfully updated", portCallTimestampId);
        }

    }

    @DeleteMapping("/{portCallTimestampId}")
    @Transactional
    public void deletePortCallTimestamp(@PathVariable int portCallTimestampId) {
        log.info("Deleting port call timestamp with id {}", portCallTimestampId);
        dsl.update(PORT_CALL_TIMESTAMP)
                .set(PORT_CALL_TIMESTAMP.DELETED, true)
                .where(PORT_CALL_TIMESTAMP.ID.eq(portCallTimestampId))
                .execute();
    }
}
