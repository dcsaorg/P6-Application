package org.dcsa.portcall.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.dcsa.portcall.db.tables.pojos.Vessel;
import org.jooq.DSLContext;
import org.jooq.Record;
import org.jooq.Record1;
import org.postgresql.util.PSQLException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.dcsa.portcall.db.tables.Vessel.VESSEL;

@RestController
@RequestMapping("/vessels")
public class VesselController {

    private static final Logger log = LogManager.getLogger(VesselController.class);
    private final DSLContext dsl;

    public VesselController(DSLContext dsl) {
        this.dsl = dsl;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public List<Vessel> listVessels() {
        log.info("Fetching all vessels");
        return dsl.select()
                .from(VESSEL)
                .orderBy(VESSEL.NAME.asc())
                .fetch()
                .into(Vessel.class);
    }

    @GetMapping("/{vesselId}")
    @Transactional(readOnly = true)
    public Vessel getVessel(@PathVariable int vesselId) {
        log.info("Loading vessel with id {}", vesselId);
        Record vessel = dsl.select()
                .from(VESSEL)
                .where(VESSEL.ID.eq(vesselId))
                .fetchOne();

        if (vessel == null) {
            String msg = String.format("Vessel with the id %s not found", vesselId);
            log.error(msg);
            throw new PortCallException(HttpStatus.NOT_FOUND, msg);
        } else {
            log.debug("Loaded vessel with id {}", vesselId);
            return vessel.into(Vessel.class);
        }
    }

    @PostMapping("")
    @Transactional
    public Vessel addVessel(@RequestBody Vessel vessel) {
        log.info("Adding vessel name: {}, imo: {}, teu:{}, service name: {}", vessel.getName(), vessel.getImo(), vessel.getTeu(), vessel.getServiceNameCode());
        try {
            Record1<Integer> id = dsl.insertInto(VESSEL, VESSEL.NAME, VESSEL.IMO, VESSEL.TEU, VESSEL.SERVICE_NAME_CODE)
                    .values(vessel.getName(), vessel.getImo(), vessel.getTeu(), vessel.getServiceNameCode())
                    .returningResult(VESSEL.ID)
                    .fetchOne();

            vessel.setId(id.value1());
        } catch (DuplicateKeyException e) {
            PortCallException portCallException = new PortCallException(HttpStatus.CONFLICT, "Duplicate Keys, The IMO number has probably already been used");
            if (e.getCause() instanceof PSQLException) {
                PSQLException cause = (PSQLException) e.getCause();
                portCallException.getErrorResponse().addErrors(cause.getServerErrorMessage().getMessage());
            }
            throw portCallException;
        }
        return vessel;
    }

    @PutMapping("/{vesselId}")
    @Transactional
    public void editVessel(@PathVariable int vesselId, @RequestBody Vessel vessel) {
        log.info("Updating vessel with id {}. Values name: {}, imo: {}, teu:{}, service name: {}",
                vesselId, vessel.getName(), vessel.getImo(), vessel.getTeu(), vessel.getServiceNameCode());
        int result = dsl.update(VESSEL)
                .set(VESSEL.NAME, vessel.getName())
                .set(VESSEL.IMO, vessel.getImo())
                .set(VESSEL.TEU, vessel.getTeu())
                .set(VESSEL.SERVICE_NAME_CODE, vessel.getServiceNameCode())
                .where(VESSEL.ID.eq(vesselId))
                .execute();
        if (result != 1) {
            String msg = String.format("Could not update vessel with id %s", vesselId);
            log.error(msg);
            throw new PortCallException(HttpStatus.BAD_REQUEST, msg);
        } else {
            log.debug("Vessel {} successfully updated", vesselId);
        }

    }

    @DeleteMapping("/{vesselId}")
    @Transactional
    public void deleteVessel(@PathVariable int vesselId) {
        int result = dsl.delete(VESSEL)
                .where(VESSEL.ID.eq(vesselId))
                .execute();

        if (result != 1) {
            String msg = String.format("Could not delete vessel with id %s", vesselId);
            log.error(msg);
            throw new PortCallException(HttpStatus.BAD_REQUEST, msg);
        } else {
            log.debug("Vessel {} successfully deleted", vesselId);
        }
    }
}
