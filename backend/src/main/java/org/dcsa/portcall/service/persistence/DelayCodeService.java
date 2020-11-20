package org.dcsa.portcall.service.persistence;

import org.dcsa.portcall.db.tables.pojos.DelayCode;
import org.jooq.DSLContext;
import org.jooq.Record;
import org.springframework.stereotype.Service;

import java.util.Optional;

import static org.dcsa.portcall.db.tables.DelayCode.DELAY_CODE;

@Service
public class DelayCodeService extends AbstractPersistenceService {

    public DelayCodeService(DSLContext dsl) {
        super(dsl);
    }

    public Optional<DelayCode> findDelayCode(int delayCodeId) {
        Record delayCode = dsl.select()
                .from(DELAY_CODE)
                .where(DELAY_CODE.ID.eq(delayCodeId))
                .fetchOne();

        if (delayCode != null) {
            return Optional.of(delayCode.into(DelayCode.class));
        } else {
            return Optional.empty();
        }
    }
}
