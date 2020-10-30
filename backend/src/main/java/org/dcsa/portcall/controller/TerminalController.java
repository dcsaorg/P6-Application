package org.dcsa.portcall.controller;


import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.dcsa.portcall.db.tables.pojos.Terminal;
import org.jooq.DSLContext;
import org.jooq.Record;
import org.jooq.Result;
import org.springframework.http.HttpStatus;
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
    private static final Logger log = LogManager.getLogger(TerminalController.class);

    private final DSLContext dsl;

    public TerminalController(DSLContext dsl) {
        this.dsl = dsl;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public List<Terminal> listTerminals() {
        log.info("Fetching all terminals");
        return dsl.select()
                .from(TERMINAL)
                .fetch()
                .into(Terminal.class);

    }

    @GetMapping("/{portId}")
    @Transactional(readOnly = true)
    public List<Terminal> getTerminalsForPort(@PathVariable int portId) {
        log.info("Loading terminals with port id {}", portId);
        Result<Record> terminals = dsl.select()
                .from(TERMINAL)
                .where(TERMINAL.PORT.eq(portId))
                .fetch();

        if (terminals == null) {
            String msg = String.format("No terminals with port id %s found", portId);
            log.error(msg);
            throw new PortCallException(HttpStatus.NOT_FOUND, msg);
        } else {
            log.debug("Loaded terminals with port id {}", portId);
            return terminals.into(Terminal.class);
        }
    }

}
