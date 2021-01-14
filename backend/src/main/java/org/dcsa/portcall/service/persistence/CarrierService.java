package org.dcsa.portcall.service.persistence;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.dcsa.portcall.PortCallProperties;
import org.dcsa.portcall.db.tables.pojos.Carrier;
import org.jooq.DSLContext;
import org.jooq.Record;
import org.springframework.stereotype.Service;

import java.util.Optional;

import static org.dcsa.portcall.db.tables.Carrier.CARRIER;
import static org.dcsa.portcall.db.tables.Vessel.VESSEL;

@Service
public class CarrierService extends AbstractPersistenceService {
    private static final Logger log = LogManager.getLogger(CarrierService.class);
    private final PortCallProperties config;

    public CarrierService(DSLContext dsl, PortCallProperties config) {
        super(dsl);
        this.config = config;
    }

    public Optional<Carrier> findCarrierById(int carrierId) {
        log.debug("Find carrier with id {}", carrierId);
        Record carrier = dsl.select()
                .from(CARRIER)
                .where(CARRIER.ID.eq(carrierId))
                .fetchOne();

        if (carrier != null) {
            return Optional.of(carrier.into(Carrier.class));
        } else {
            return Optional.empty();
        }
    }

    public Optional<Carrier> findBySMDGCode(String smdgCode) {
        log.debug("Find carrier with smdg code");
        Record carrier = this.dsl.select()
                .from(CARRIER)
                .where(CARRIER.SMDG_CODE.eq(smdgCode.toUpperCase()))
                .fetchOne();

        if (carrier != null) {
            return Optional.of(carrier.into(Carrier.class));
        } else {
            return Optional.empty();
        }
    }

    public Optional<Carrier> findCarrierByVesselId(int vesselId) {
        log.debug("Get carrier from id by id {}", vesselId);
        Record carrier = dsl.select()
                .from(CARRIER)
                .join(VESSEL).on(VESSEL.CARRIER.eq(CARRIER.ID))
                .where(VESSEL.ID.eq(vesselId))
                .fetchOne();

        if (carrier != null) {
            return Optional.of(carrier.into(Carrier.class));
        } else {
            return Optional.empty();
        }
    }
}
