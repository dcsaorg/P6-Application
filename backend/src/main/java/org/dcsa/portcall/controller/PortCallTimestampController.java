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
import org.dcsa.portcall.db.tables.pojos.Port;
import org.dcsa.portcall.db.tables.pojos.PortCallTimestamp;
import org.dcsa.portcall.model.PortCallTimestampExtended;
import org.dcsa.portcall.service.OutboundPortCallMessageService;
import org.dcsa.portcall.service.persistence.PortCallTimestampService;
import org.dcsa.portcall.service.persistence.PortService;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

import static org.dcsa.portcall.util.TimeZoneConverter.convertToTimezone;

/**
 * <p>&copy; 2020 <a href="http://www.ponton.de" target="_blank">PONTON GmbH</a></p>
 */
@RestController
@RequestMapping("/portcalltimestamps")
public class PortCallTimestampController {
    private static final Logger log = LogManager.getLogger(PortCallTimestampController.class);

    private final PortService portService;
    private final PortCallTimestampService portCallTimestampService;
    private final OutboundPortCallMessageService outboundPortCallMessageService;

    public PortCallTimestampController(PortService portService,
                                       PortCallTimestampService portCallTimestampService,
                                       OutboundPortCallMessageService outboundPortCallMessageService) {
        this.portService = portService;
        this.portCallTimestampService = portCallTimestampService;
        this.outboundPortCallMessageService = outboundPortCallMessageService;
    }


    @GetMapping
    @Transactional(readOnly = true)
    public List<PortCallTimestampExtended> listPortCallTimestamps() {
        log.info("Listing all port call timestamps");
        List<PortCallTimestampExtended> resp = portCallTimestampService.findTimestamps();
        return resp;
    }

    @GetMapping("/{vesselId}")
    @Transactional(readOnly = true)
    public List<PortCallTimestampExtended> listPortCallTimestampsByVesselId(@PathVariable int vesselId) {
        log.info("Listing all port call timestamps for vessel {}", vesselId);
        return portCallTimestampService.findTimestampsByVesselId(vesselId);
    }

    @GetMapping("/highestTimestampId/{vesselId}")
    public Integer getHighestTimestampId(@PathVariable int vesselId) {
        log.info("Loading highest timestamp id of port call timestamps with vessel id {} ", vesselId);
        return portCallTimestampService.getHighestTimestampId(vesselId);
    }

    @GetMapping("/highestTimestamp/{vesselId}")
    public PortCallTimestamp getHighestTimestamp(@PathVariable int vesselId) {
        if (vesselId >= 0) {
            log.info("Loading highest timestamp  of port call timestamps with vessel id {} ", vesselId);
            return portCallTimestampService.getHighestTimestamp(vesselId);
        } else {
            log.debug("No vessel id supplied");
            return null;
        }
    }

    @PostMapping()
    public PortCallTimestamp addPortCallTimestamp(@RequestBody final PortCallTimestamp portCallTimestamp) {
        log.info("Add PortCall Timestamp requested for vessel id [{}]", portCallTimestamp.getVessel());
        portCallTimestamp.setModifiable(true);

        Port portOfCall = portService.findPortById(portCallTimestamp.getPortOfCall()).get();
        portCallTimestamp.setEventTimestamp(convertToTimezone(portCallTimestamp.getEventTimestamp(), portOfCall));
        portCallTimestamp.setLogOfTimestamp(convertToTimezone(portCallTimestamp.getLogOfTimestamp(), portOfCall));

        // check if Timestamps are prior current time
        OffsetDateTime now = OffsetDateTime.now(ZoneOffset.UTC);
        if (portCallTimestamp.getLogOfTimestamp().isAfter(now)) {
            String msg = String.format("Log timestamp [%s] is in the future", portCallTimestamp.getLogOfTimestamp());
            log.error(msg);
            PortCallException portCallException = new PortCallException(HttpStatus.CONFLICT, msg);
            throw portCallException;
        }

        portCallTimestampService.addTimestamp(portCallTimestamp);

        // Generate PortCall Message
        outboundPortCallMessageService.process(portCallTimestamp);

        return portCallTimestamp;
    }


    @PutMapping("/{portCallTimestampId}")
    @Transactional
    public void updatePortcallTimestampDelayCodeAndComment(@PathVariable int portCallTimestampId, @RequestBody PortCallTimestamp portCallTimestamp) {
        log.info("Updating port call timestamp with id {}", portCallTimestampId);
        int result = portCallTimestampService.updatePortcallTimestampDelayCodeAndComment(portCallTimestamp);
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
        int result = portCallTimestampService.deletePortCallTimestamp(portCallTimestampId);
        if (result != 1) {
            String msg = String.format("Could not delete port call timestamp with id %s", portCallTimestampId);
            log.error(msg);
            throw new PortCallException(HttpStatus.BAD_REQUEST, msg);
        } else {
            log.debug("Port call timestamp {} successfully deleted", portCallTimestampId);
        }
    }

    @PostMapping("/accept")
    @Transactional
    public PortCallTimestamp acceptPortCallTimestamp(@RequestBody final PortCallTimestampExtended timestamp) {
        PortCallTimestamp acceptTimestamp = this.portCallTimestampService.acceptTimestamp(timestamp);
        // Generate PortCall Message
        outboundPortCallMessageService.process(acceptTimestamp);
        return acceptTimestamp;

    }
}
