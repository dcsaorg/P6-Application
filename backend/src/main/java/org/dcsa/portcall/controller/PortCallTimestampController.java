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
import org.dcsa.portcall.service.PortCallMessageGeneratorService;
import org.dcsa.portcall.service.persistence.PortCallTimestampService;
import org.dcsa.portcall.service.persistence.PortService;
import org.dcsa.portcall.service.persistence.VesselService;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * <p>&copy; 2020 <a href="http://www.ponton.de" target="_blank">PONTON GmbH</a></p>
 */
@RestController
@RequestMapping("/portcalltimestamps")
public class PortCallTimestampController {
    private static final Logger log = LogManager.getLogger(PortCallTimestampController.class);

    private final PortService portService;
    private final VesselService vesselService;
    private final PortCallTimestampService portCallTimestampService;
    private final PortCallMessageGeneratorService portCallMessageGeneratorService;

    public PortCallTimestampController(PortService portService,
                                       VesselService vesselService,
                                       PortCallTimestampService portCallTimestampService,
                                       PortCallMessageGeneratorService portCallMessageGeneratorService) {
        this.portService = portService;
        this.vesselService = vesselService;
        this.portCallTimestampService = portCallTimestampService;
        this.portCallMessageGeneratorService = portCallMessageGeneratorService;
    }


    @GetMapping("/{vesselId}")
    @Transactional(readOnly = true)
    public List<PortCallTimestamp> listPortCallTimestamps(@PathVariable int vesselId) {
        log.info("Listing all port call timestamps for vessel {}", vesselId);
        return portCallTimestampService.findTimestamps(vesselId);
    }

    @GetMapping("/highestTimestampId/{vesselId}")
    public Integer getHighestTimestampId(@PathVariable int vesselId) {
        log.info("Loading highest timestamp id of port call timestamps with vessel id {} ", vesselId);
        return portCallTimestampService.getHighestTimestampId(vesselId);
    }

    @PostMapping("/{vesselId}")
    public PortCallTimestamp addPortCallTimestamp(@PathVariable final int vesselId, @RequestBody final PortCallTimestamp portCallTimestamp) {
        log.info("Add PortCall Timestamp requested for vessel id [{}]", vesselId);
        portCallTimestamp.setVessel(vesselId);
        portCallTimestampService.addTimestamp(portCallTimestamp);

        // Generate PortCall Message
        portCallMessageGeneratorService.generate(portCallTimestamp);

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
}
