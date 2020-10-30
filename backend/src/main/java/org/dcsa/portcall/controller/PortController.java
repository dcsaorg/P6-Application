package org.dcsa.portcall.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.dcsa.portcall.db.tables.pojos.Port;
import org.jooq.DSLContext;
import org.jooq.Record;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.dcsa.portcall.db.tables.Port.PORT;

@RestController
@RequestMapping("/ports")
public class PortController {

    private static final Logger log = LogManager.getLogger(PortController.class);
    private final DSLContext dsl;

    public  PortController(DSLContext dsl){
        this.dsl = dsl;
    }


    @GetMapping
    @Transactional(readOnly = true)
    public List<Port> listPorts(){
        log.info("Fetching all ports");
        return  dsl.select()
                .from(PORT)
                .fetch()
                .into(Port.class);

    }

    @GetMapping("/find/{searchString}")
    @Transactional(readOnly = true)
    public List<Port> findPorts(@PathVariable String searchString){
        log.info("Searching for ports: {}", searchString);
        return dsl.select()
                .from(PORT)
                .where(PORT.UN_LOCODE.like(searchString))
                .or(PORT.NAME.like(searchString))
                .fetch()
                .into(Port.class);
    }

    @GetMapping("/{portId}")
    @Transactional(readOnly = true)
    public Port getPortById(@PathVariable int portId){
        log.info("Loading port with id {}", portId);
        Record port = dsl.select()
                .from(PORT)
                .where(PORT.ID.eq(portId))
                .fetchOne();

        if (port == null) {
            String msg = String.format("Port with the id %s not found", portId);
            log.error(msg);
            throw new PortCallException(HttpStatus.NOT_FOUND, msg);
        } else {
            log.debug("Loaded port with id {}", portId);
            return port.into(Port.class);
        }
    }

}
