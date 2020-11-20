package org.dcsa.portcall.service.persistence;

import org.dcsa.portcall.db.tables.pojos.Vessel;
import org.jooq.DSLContext;
import org.jooq.Record;
import org.springframework.stereotype.Service;

import java.util.Optional;

import static org.dcsa.portcall.db.tables.Vessel.VESSEL;

@Service
public class VesselService extends AbstractPersistenceService {

    public VesselService(DSLContext dsl) {
        super(dsl);
    }

    public Optional<Vessel> findVessel(int vesselId) {
        Record vessel = dsl.select()
                .from(VESSEL)
                .where(VESSEL.ID.eq(vesselId))
                .fetchOne();

        if (vessel != null) {
            return Optional.of(vessel.into(Vessel.class));
        } else {
            return Optional.empty();
        }
    }
}
