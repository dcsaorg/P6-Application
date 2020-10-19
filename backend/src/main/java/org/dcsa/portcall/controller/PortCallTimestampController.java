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
import org.dcsa.portcall.db.tables.pojos.PortCallTimestamp;
import org.jooq.DSLContext;
import org.jooq.Record1;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.dcsa.portcall.db.tables.PortCallTimestamp.PORT_CALL_TIMESTAMP;

/**
 * <p>&copy; 2020 <a href="http://www.ponton.de" target="_blank">PONTON GmbH</a></p>
 * <p>
 * [description of the class]
 *
 * @author <a href="[bischof@ponton.de]">[Paul Bischof]</a>
 * @version 15.10.2020
 * [potential @see links]
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
        return dsl.select()
                .from(PORT_CALL_TIMESTAMP)
                .where(PORT_CALL_TIMESTAMP.VESSEL.eq(vesselId)
                        .and(PORT_CALL_TIMESTAMP.DELETED.eq(false)))
                .fetch()
                .into(PortCallTimestamp.class);
    }

    @PostMapping("/{vesselId}")
    @Transactional
    public PortCallTimestamp addPortCallTimestamp(@PathVariable int vesselId, @RequestBody PortCallTimestamp portCallTimestamp) {
        Record1<Integer> id =
                dsl.insertInto(PORT_CALL_TIMESTAMP, PORT_CALL_TIMESTAMP.VESSEL,
                        PORT_CALL_TIMESTAMP.PORT_OF_CALL, PORT_CALL_TIMESTAMP.PORT_PREVIOUS, PORT_CALL_TIMESTAMP.PORT_NEXT,
                        PORT_CALL_TIMESTAMP.TIMESTAMP_TYPE, PORT_CALL_TIMESTAMP.EVENT_TIMESTAMP, PORT_CALL_TIMESTAMP.LOG_OF_TIMESTAMP,
                        PORT_CALL_TIMESTAMP.DIRECTION, PORT_CALL_TIMESTAMP.TERMINAL, PORT_CALL_TIMESTAMP.LOCATION_ID,
                        PORT_CALL_TIMESTAMP.CHANGE_COMMENT, PORT_CALL_TIMESTAMP.DELAY_CODE)
                        .values(vesselId,
                                portCallTimestamp.getPortOfCall(), portCallTimestamp.getPortPrevious(), portCallTimestamp.getPortNext(),
                                portCallTimestamp.getTimestampType(), portCallTimestamp.getEventTimestamp(), portCallTimestamp.getLogOfTimestamp(),
                                portCallTimestamp.getDirection(), portCallTimestamp.getTerminal(), portCallTimestamp.getLocationId(),
                                portCallTimestamp.getChangeComment(), portCallTimestamp.getDelayCode())
                        .returningResult(PORT_CALL_TIMESTAMP.ID)
                        .fetchOne();
        portCallTimestamp.setId(id.value1());
        return portCallTimestamp;
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
