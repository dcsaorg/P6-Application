package org.dcsa.portcall.controller;

import org.dcsa.portcall.db.tables.pojos.Port;
import org.jooq.DSLContext;
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

    private final DSLContext dsl;

    public  PortController(DSLContext dsl){
        this.dsl = dsl;
    }


    @GetMapping
    @Transactional(readOnly = true)
    public List<Port> listPorts(){
        return  dsl.select()
                .from(PORT)
                .fetch()
                .into(Port.class);

    }

    @GetMapping("/find/{searchString}")
    @Transactional(readOnly = true)
    public List<Port> findPorts(@PathVariable String searchString){
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
        return dsl.select()
                .from(PORT)
                .where(PORT.ID.eq(portId))
                .fetchOne()
                .into(Port.class);
    }

}
