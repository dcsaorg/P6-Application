package org.dcsa.portcall.controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.dcsa.portcall.db.tables.pojos.DelayCode;
import org.jooq.DSLContext;
import org.jooq.Record;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static org.dcsa.portcall.db.tables.DelayCode.DELAY_CODE;

@RestController
@RequestMapping("/delaycodes")
public class DelayCodeController {

    private static final Logger log = LogManager.getLogger(DelayCodeController.class);
    private final DSLContext dsl;

    public DelayCodeController(DSLContext dsl){
        this.dsl = dsl;
    }

    @GetMapping("/{delayCodeId}")
    @Transactional(readOnly = true)
    public DelayCode getDelayCode(@PathVariable int delayCodeId) {
        log.info("Loading delay code with id {}", delayCodeId);
        Record delayCode = dsl.select()
                .from(DELAY_CODE)
                .where(DELAY_CODE.ID.eq(delayCodeId))
                .fetchOne();

        if (delayCode == null) {
            String msg = String.format("Delay code with the id %s not found", delayCodeId);
            log.error(msg);
            throw new PortCallException(HttpStatus.NOT_FOUND, msg);
        } else {
            log.debug("Loaded delay code with id {}", delayCodeId);
            return delayCode.into(DelayCode.class);
        }
    }{}

    @GetMapping
    @Transactional(readOnly = true)
    public List<DelayCode> getDelayCodes(){
        return dsl.select()
                .from(DELAY_CODE)
                .fetch()
                .into(DelayCode.class);
    }

}
