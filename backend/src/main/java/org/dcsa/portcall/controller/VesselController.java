package org.dcsa.portcall.controller;

import org.dcsa.portcall.db.tables.pojos.Vessel;
import org.dcsa.portcall.db.tables.records.VesselRecord;
import org.jooq.DSLContext;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.dcsa.portcall.db.tables.Vessel.VESSEL;

@RestController
public class VesselController {

    DSLContext dsl;

    public VesselController(DSLContext dsl) {
        this.dsl = dsl;
    }

    @GetMapping("/vessels")
    public List<String> vessels() {
        return dsl.select(VESSEL.NAME).from(VESSEL).fetch(VESSEL.NAME);
    }

    @PostMapping("/vessel")
    public Vessel addVessel(@RequestBody Vessel vessel) {
        final VesselRecord vesselRecord = dsl.newRecord(VESSEL, vessel);
        dsl.executeInsert(vesselRecord);
        return dsl.select().from(VESSEL).where(VESSEL.ID.eq(vesselRecord.getId())).fetchAny().into(Vessel.class);
    }

}
