package org.dcsa.portcall.service.persistence;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.dcsa.portcall.db.tables.pojos.Carrier;
import org.jooq.DSLContext;
import org.jooq.Record;
import static org.dcsa.portcall.db.tables.Carrier.CARRIER;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CarrierService extends AbstractPersistenceService {
    private static final Logger log = LogManager.getLogger(CarrierVesselPortHistoryService.class);

    public CarrierService(DSLContext dsl) {
        super(dsl);
    }

    public Optional<Carrier> getCarrierById(int carrierID){
        log.debug("Get carrier from id by carrierId {}", carrierID);
        Record rec = this.dsl.select()
                .from(CARRIER)
                .where(CARRIER.ID.eq(carrierID))
                .fetchOne();

        if(rec!=null){
            return Optional.of(rec.into(Carrier.class));
        } else {
            return Optional.empty();
        }
    }

    public Optional<Carrier> getCarrierByCode(String carrierCode){
        Record rec = this.dsl.select()
                .from(CARRIER)
                .where(CARRIER.SMDG_CODE.eq(carrierCode))
                .fetchOne();

        if(rec!=null){
            return Optional.of(rec.into(Carrier.class));
        } else {
            return Optional.empty();
        }
    }


}
