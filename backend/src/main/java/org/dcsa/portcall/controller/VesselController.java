package org.dcsa.portcall.controller;

import org.jooq.DSLContext;
import org.springframework.web.bind.annotation.GetMapping;
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

}
