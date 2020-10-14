package org.dcsa.portcall.controller;

import org.dcsa.portcall.db.tables.pojos.Vessel;
import org.jooq.DSLContext;
import org.jooq.Record1;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.dcsa.portcall.db.tables.Vessel.VESSEL;

@RestController
public class VesselController {

    DSLContext dsl;

    public VesselController(DSLContext dsl) {
        this.dsl = dsl;
    }

    @GetMapping("/vessels")
    @Transactional(readOnly = true)
    public List<Vessel> listVessels() {
        return dsl.select()
                .from(VESSEL)
                .fetch()
                .into(Vessel.class);
    }

    @GetMapping("/vessel")
    @Transactional(readOnly = true)
    public Vessel getVessel(@RequestParam int vesselId) {
        return dsl.select()
                .from(VESSEL)
                .where(VESSEL.ID.eq(vesselId))
                .fetchAny()
                .into(Vessel.class);
    }

    @PostMapping("/vessel")
    @Transactional
    public Vessel addVessel(@RequestBody Vessel vessel) {
        Record1<Integer> id = dsl.insertInto(VESSEL, VESSEL.NAME, VESSEL.IMO, VESSEL.TEU, VESSEL.SERVICE_NAME)
                .values(vessel.getName(), vessel.getImo(), vessel.getTeu(), vessel.getServiceName())
                .returningResult(VESSEL.ID)
                .fetchOne();
        vessel.setId(id.value1());
        return vessel;
    }

    @PutMapping("/vessel")
    @Transactional
    public void editVessel(@RequestParam int vesselId, @RequestBody Vessel vessel) {
        dsl.update(VESSEL)
                .set(VESSEL.NAME, vessel.getName())
                .set(VESSEL.IMO, vessel.getImo())
                .set(VESSEL.TEU, vessel.getTeu())
                .set(VESSEL.SERVICE_NAME, vessel.getServiceName())
                .where(VESSEL.ID.eq(vesselId))
                .execute();
    }

    @DeleteMapping("/vessel")
    @Transactional
    public void deleteVessel(@RequestParam int vesselId) {
        dsl.delete(VESSEL)
                .where(VESSEL.ID.eq(vesselId))
                .execute();
    }
}
