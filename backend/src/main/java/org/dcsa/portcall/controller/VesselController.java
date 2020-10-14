package org.dcsa.portcall.controller;

import org.dcsa.portcall.db.tables.pojos.Vessel;
import org.dcsa.portcall.db.tables.records.VesselRecord;
import org.jooq.DSLContext;
import org.jooq.InsertQuery;
import org.jooq.Record1;
import org.springframework.transaction.annotation.Transactional;
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
    @Transactional(readOnly = true)
    public List<Vessel> listVessels() {
        return dsl.select().from(VESSEL).fetch().into(Vessel.class);
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

}
