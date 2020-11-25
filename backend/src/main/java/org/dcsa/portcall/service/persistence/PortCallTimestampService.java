package org.dcsa.portcall.service.persistence;

import org.dcsa.portcall.db.tables.pojos.PortCallTimestamp;
import org.jooq.DSLContext;
import org.jooq.Record;
import org.jooq.Result;
import org.springframework.stereotype.Service;

import java.util.List;

import static org.dcsa.portcall.db.tables.PortCallTimestamp.PORT_CALL_TIMESTAMP;

@Service
public class PortCallTimestampService extends AbstractPersistenceService {

    public PortCallTimestampService(DSLContext dsl) {
        super(dsl);
    }

    public List<PortCallTimestamp> findTimestampsById(int vesselId) {
        Result<Record> timestamps = dsl.select()
                .from(PORT_CALL_TIMESTAMP)
                .where(PORT_CALL_TIMESTAMP.VESSEL.eq(vesselId)
                        .and(PORT_CALL_TIMESTAMP.DELETED.eq(false)))
                .fetch();

        return timestamps.into(PortCallTimestamp.class);
    }

    public List<PortCallTimestamp> findTimestamps() {
        Result<Record> timestamps = dsl.select()
                .from(PORT_CALL_TIMESTAMP)
                .where(PORT_CALL_TIMESTAMP.DELETED.eq(false))
                .fetch();
        return timestamps.into(PortCallTimestamp.class);
    }
}
