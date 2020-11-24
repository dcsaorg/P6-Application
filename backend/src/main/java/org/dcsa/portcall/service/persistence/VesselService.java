package org.dcsa.portcall.service.persistence;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.util.Strings;
import org.dcsa.portcall.PortCallProperties;
import org.dcsa.portcall.controller.PortCallException;
import org.dcsa.portcall.db.tables.pojos.Carrier;
import org.dcsa.portcall.db.tables.pojos.Vessel;
import org.dcsa.portcall.message.RoleType;
import org.jooq.DSLContext;
import org.jooq.Record;
import org.jooq.Record1;
import org.postgresql.util.PSQLException;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.dcsa.portcall.db.tables.Vessel.VESSEL;

@Service
public class VesselService extends AbstractPersistenceService {

    private static final Logger log = LogManager.getLogger(VesselService.class);

    private final PortCallProperties properties;
    private final CarrierService carrierService;

    public VesselService(DSLContext dsl, PortCallProperties properties, CarrierService carrierService) {
        super(dsl);
        this.properties = properties;
        this.carrierService = carrierService;
    }

    @Transactional(readOnly = true)
    public List<Vessel> listVessels() {
        return dsl.select()
                .from(VESSEL)
                .orderBy(VESSEL.NAME.asc())
                .fetch()
                .into(Vessel.class);
    }

    @Transactional(readOnly = true)
    public Optional<Vessel> findVesselById(int vesselId) {
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

    @Transactional(readOnly = true)
    public Optional<Vessel> findVesselByIMO(int imo) {
        Record vessel = dsl.select()
                .from(VESSEL)
                .where(VESSEL.IMO.eq(imo))
                .fetchOne();

        if (vessel != null) {
            return Optional.of(vessel.into(Vessel.class));
        } else {
            return Optional.empty();
        }
    }

    @Transactional(readOnly = true)
    public Optional<Vessel> findVesselByName(String name) {
        Record vessel = dsl.select()
                .from(VESSEL)
                .where(VESSEL.NAME.eq(name))
                .fetchOne();

        if (vessel != null) {
            return Optional.of(vessel.into(Vessel.class));
        } else {
            return Optional.empty();
        }
    }

    @Transactional
    public void addVessel(Vessel vessel) {
        try {
            if (vessel.getCarrier() == null && RoleType.CARRIER.equals(properties.getSenderRole()) && Strings.isNotBlank(properties.getSenderId())) {
                log.debug("Search for carrier with smdg code '{}'", properties.getSenderId());
                Optional<Carrier> carrier = carrierService.findBySMDGCode(properties.getSenderId());
                if (carrier.isPresent()) {
                    vessel.setCarrier(carrier.get().getId());
                } else {
                    String msg = String.format("Could not find carrier with smdg code '%s'", properties.getSenderId());
                    log.fatal(msg);
                    throw new IllegalStateException(msg);
                }
            } else if (vessel.getCarrier() == null) {
                String msg = String.format("Trying to add vessel '%s, %s' without carrier as '%s 'role", vessel.getName(), vessel.getImo(), properties.getSenderId());
                log.fatal(msg);
                throw new IllegalStateException(msg);
            }
            Record1<Integer> id = dsl.insertInto(VESSEL, VESSEL.NAME, VESSEL.CARRIER, VESSEL.IMO, VESSEL.TEU, VESSEL.SERVICE_NAME_CODE)
                    .values(vessel.getName(), vessel.getCarrier(), vessel.getImo(), vessel.getTeu(), vessel.getServiceNameCode())
                    .returningResult(VESSEL.ID)
                    .fetchOne();

            vessel.setId(id.value1());
        } catch (DuplicateKeyException e) {
            PortCallException portCallException = new PortCallException(HttpStatus.CONFLICT, "Duplicate Keys, The IMO number has probably already been used");
            if (e.getCause() instanceof PSQLException) {
                PSQLException cause = (PSQLException) e.getCause();
                portCallException.getErrorResponse().addErrors(cause.getServerErrorMessage().getMessage());
            }
            throw portCallException;
        }
    }

    /**
     * Updates the values of the given vessel.
     *
     * @return Number of rows updated
     */
    @Transactional
    public int updateVessel(Vessel vessel) {
        return dsl.update(VESSEL)
                .set(VESSEL.NAME, vessel.getName())
                .set(VESSEL.IMO, vessel.getImo())
                .set(VESSEL.TEU, vessel.getTeu())
                .set(VESSEL.SERVICE_NAME_CODE, vessel.getServiceNameCode())
                .where(VESSEL.ID.eq(vessel.getId()))
                .execute();
    }

    /**
     * Deletes the vessel with the given id
     *
     * @return Number of deleted vessels
     */
    @Transactional
    public int deleteVessel(int vesselId) {
        return dsl.delete(VESSEL)
                .where(VESSEL.ID.eq(vesselId))
                .execute();
    }
}
