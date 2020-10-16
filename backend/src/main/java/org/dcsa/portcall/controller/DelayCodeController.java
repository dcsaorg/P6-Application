package org.dcsa.portcall.controller;

import org.dcsa.portcall.db.tables.pojos.DelayCode;
import org.jooq.DSLContext;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.dcsa.portcall.db.tables.DelayCode.DELAY_CODE;

@RestController
@RequestMapping("/delaycodes")
public class DelayCodeController {

    private final DSLContext dsl;

    public DelayCodeController(DSLContext dsl){
        this.dsl = dsl;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public List<DelayCode> getDelayCodes(){
        return dsl.select()
                .from(DELAY_CODE)
                .fetch()
                .into(DelayCode.class);
    }

}
