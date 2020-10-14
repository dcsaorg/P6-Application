package org.dcsa.portcall.controller;


import org.dcsa.portcall.db.tables.pojos.Terminal;
import org.jooq.DSLContext;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.dcsa.portcall.db.tables.Terminal.TERMINAL;

@RestController
@RequestMapping("/terminals")
public class TerminalController {

    DSLContext dsl;

    public TerminalController(DSLContext dsl){
        this.dsl = dsl;
    }

    @GetMapping("/{portId}")
    @Transactional(readOnly = true)
    public Terminal getTerminalsForPort(@PathVariable int portId){
        return dsl.select()
                .from(TERMINAL)
                .where(TERMINAL.PORT.eq(portId))
                .fetchAny()
                .into(Terminal.class);
    }

}
