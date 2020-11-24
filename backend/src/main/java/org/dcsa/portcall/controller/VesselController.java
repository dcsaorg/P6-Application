package org.dcsa.portcall.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.dcsa.portcall.db.tables.pojos.Vessel;
import org.dcsa.portcall.service.persistence.VesselService;
import org.postgresql.util.PSQLException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/vessels")
public class VesselController {

    private static final Logger log = LogManager.getLogger(VesselController.class);
    private VesselService vesselService;

    public VesselController(VesselService vesselService) {
        this.vesselService = vesselService;
    }

    @GetMapping
    public List<Vessel> listVessels() {
        log.info("Fetching all vessels");
        return vesselService.listVessels();
    }

    @GetMapping("/{vesselId}")
    public Vessel getVessel(@PathVariable int vesselId) {
        log.info("Loading vessel with id {}", vesselId);
        Optional<Vessel> vessel = vesselService.findVesselById(vesselId);

        if (vessel.isEmpty()) {
            String msg = String.format("Vessel with the id %s not found", vesselId);
            log.error(msg);
            throw new PortCallException(HttpStatus.NOT_FOUND, msg);
        } else {
            log.debug("Loaded vessel with id {}", vesselId);
            return vessel.get();
        }
    }

    @PostMapping("")
    @Transactional
    public Vessel addVessel(@RequestBody Vessel vessel) {
        log.info("Adding vessel name: {}, imo: {}, teu:{}, service name: {}", vessel.getName(), vessel.getImo(), vessel.getTeu(), vessel.getServiceNameCode());
        try {
            vesselService.addVessel(vessel);
            return vessel;
        } catch (DuplicateKeyException e) {
            PortCallException portCallException = new PortCallException(HttpStatus.CONFLICT, "Duplicate Keys, The IMO number has probably already been used");
            if (e.getCause() instanceof PSQLException) {
                PSQLException cause = (PSQLException) e.getCause();
                portCallException.getErrorResponse().addErrors(cause.getServerErrorMessage().getMessage());
            }
            throw portCallException;
        }
    }

    @PutMapping("/{vesselId}")
    public void editVessel(@PathVariable int vesselId, @RequestBody Vessel vessel) {
        log.info("Updating vessel with id {}. Values name: {}, imo: {}, teu:{}, service name: {}",
                vesselId, vessel.getName(), vessel.getImo(), vessel.getTeu(), vessel.getServiceNameCode());
        int result = vesselService.updateVessel(vessel);
        if (result != 1) {
            String msg = String.format("Could not update vessel with id %s", vesselId);
            log.error(msg);
            throw new PortCallException(HttpStatus.BAD_REQUEST, msg);
        } else {
            log.debug("Vessel {} successfully updated", vesselId);
        }

    }

    @DeleteMapping("/{vesselId}")
    public void deleteVessel(@PathVariable int vesselId) {
        int result = vesselService.deleteVessel(vesselId);

        if (result != 1) {
            String msg = String.format("Could not delete vessel with id %s", vesselId);
            log.error(msg);
            throw new PortCallException(HttpStatus.BAD_REQUEST, msg);
        } else {
            log.debug("Vessel {} successfully deleted", vesselId);
        }
    }
}
