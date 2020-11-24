package org.dcsa.portcall.service.persistence;

import org.dcsa.portcall.db.tables.pojos.Port;
import org.jooq.DSLContext;
import org.jooq.Record;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static org.dcsa.portcall.db.tables.Port.PORT;

@Service
public class PortService extends AbstractPersistenceService {

    public PortService(DSLContext dsl) {
        super(dsl);
    }

    @Transactional(readOnly = true)
    public Optional<Port> findPort(int portId) {
        Record port = dsl.select()
                .from(PORT)
                .where(PORT.ID.eq(portId))
                .fetchOne();

        if (port != null) {
            return Optional.of(port.into(Port.class));
        } else {
            return Optional.empty();
        }
    }
}
