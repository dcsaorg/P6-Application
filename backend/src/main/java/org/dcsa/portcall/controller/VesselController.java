package org.dcsa.portcall.controller;

import org.dcsa.portcall.db.tables.pojos.Vessel;
import org.jooq.DSLContext;
import org.jooq.Record1;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static org.dcsa.portcall.db.tables.Vessel.VESSEL;

@RestController
@RequestMapping("/vessels")
public class VesselController {

    DSLContext dsl;

    public VesselController(DSLContext dsl) {
        this.dsl = dsl;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public List<Vessel> listVessels() {
        return dsl.select()
                .from(VESSEL)
                .fetch()
                .into(Vessel.class);
    }

    @GetMapping("/{vesselId}")
    @Transactional(readOnly = true)
    public Vessel getVessel(@PathVariable int vesselId) {
        return dsl.select()
                .from(VESSEL)
                .where(VESSEL.ID.eq(vesselId))
                .fetchAny()
                .into(Vessel.class);
    }

    @PostMapping("")
    @Transactional
    public Vessel addVessel(@RequestBody Vessel vessel) {
        Record1<Integer> id = dsl.insertInto(VESSEL, VESSEL.NAME, VESSEL.IMO, VESSEL.TEU, VESSEL.SERVICE_NAME_CODE)
                .values(vessel.getName(), vessel.getImo(), vessel.getTeu(), vessel.getServiceNameCode())
                .returningResult(VESSEL.ID)
                .fetchOne();
        vessel.setId(id.value1());
        return vessel;
    }

    @PutMapping("/{vesselId}")
    @Transactional
    public void editVessel(@PathVariable int vesselId, @RequestBody Vessel vessel) {
        dsl.update(VESSEL)
                .set(VESSEL.NAME, vessel.getName())
                .set(VESSEL.IMO, vessel.getImo())
                .set(VESSEL.TEU, vessel.getTeu())
                .set(VESSEL.SERVICE_NAME_CODE, vessel.getServiceNameCode())
                .where(VESSEL.ID.eq(vesselId))
                .execute();
    }

    @DeleteMapping("/{vesselId}")
    @Transactional
    public void deleteVessel(@PathVariable int vesselId) {
        dsl.delete(VESSEL)
                .where(VESSEL.ID.eq(vesselId))
                .execute();
    }
}
