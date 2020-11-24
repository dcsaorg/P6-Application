package org.dcsa.portcall.service.persistence;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.dcsa.portcall.PortCallProperties;
import org.dcsa.portcall.db.tables.pojos.Carrier;
import org.jooq.DSLContext;
import org.jooq.Record;
import static org.dcsa.portcall.db.tables.Carrier.CARRIER;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class CarrierService extends AbstractPersistenceService {
    private static final Logger log = LogManager.getLogger(CarrierVesselPortHistoryService.class);
    private final PortCallProperties config;

    public CarrierService(DSLContext dsl, PortCallProperties config) {
        super(dsl);
        this.config = config;
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

    /**
     * Function that gets a carrier by smdgcode and if the code is not known, and predefined in configs
     * the unknown carrier code gets stored to database
     */
    public Optional<Carrier> getCarrierByCodeControlled(String carrierCode){
        Optional<Carrier> carrier = this.getCarrierByCode(carrierCode);
        if(carrier.isEmpty()){
            if(this.config.getManagement().isStoreUnknownCarrier()){
                log.info("Carrier code {} is not known, as store-unknown-carrier is true, this will be stored to database.", carrierCode);
                carrier = this.insertCarrierByCode(carrierCode);
            }
        }
        return carrier;
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

    public Optional<Carrier> insertCarrierByCode(String carrierCode){
        Record rec = this.dsl.insertInto(CARRIER,
                        CARRIER.SMDG_CODE,
                        CARRIER.LINE,
                        CARRIER.VALID_FROM)
                    .values(
                        carrierCode, "UNKNOWN", LocalDate.now()
                    ).returningResult(
                            CARRIER.ID)
                    .fetchOne();
        Carrier carrier = new Carrier();
        carrier.setSmdgCode(carrierCode);
        carrier.setId(rec.get(CARRIER.ID));

        if(carrier.getId() != null){
            return Optional.of(carrier);
        } else {
            log.warn("Could not store carrier code {} to database!", carrierCode);
            return Optional.empty();
        }
    }


}
