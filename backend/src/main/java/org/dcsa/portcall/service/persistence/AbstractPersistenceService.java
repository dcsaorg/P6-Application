package org.dcsa.portcall.service.persistence;

import org.jooq.DSLContext;

public abstract class AbstractPersistenceService {

    protected final DSLContext dsl;

    protected AbstractPersistenceService(DSLContext dsl) {
        this.dsl = dsl;
    }
}
