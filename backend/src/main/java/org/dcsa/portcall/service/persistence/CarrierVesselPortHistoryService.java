package org.dcsa.portcall.service.persistence;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.dcsa.portcall.PortCallProperties;
import org.dcsa.portcall.db.tables.pojos.Carrier;
import org.dcsa.portcall.db.tables.pojos.CarrierVesselPortHistory;
import org.dcsa.portcall.db.tables.pojos.PortCallTimestamp;
import org.jooq.*;
import static org.dcsa.portcall.db.tables.CarrierVesselPortHistory.CARRIER_VESSEL_PORT_HISTORY;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class CarrierVesselPortHistoryService extends AbstractPersistenceService {


    private static final Logger log = LogManager.getLogger(CarrierVesselPortHistoryService.class);
    private final PortCallProperties config;

    public CarrierVesselPortHistoryService(DSLContext dsl, PortCallProperties config) {
        super(dsl);
        this.config = config;
    }

     /**
     * Function receives a timestamp and a carrier and depending if for the combination of
     * PortOfCall, PreviousPort, NextPort, Terminal, Vessel and Carrier an entry exists or not,
     * the existing ones  gets updated or a new entry is created.
     * Entries with an timestamp > the defined lookback threshold are getting remove
     * to keep the table clean
     *
     */
    public CarrierVesselPortHistory updateHistory(PortCallTimestamp timestamp, Carrier carrier) {

        //First clean up history!
        this.cleanUpHistory();

        Optional<CarrierVesselPortHistory> historyOption = this.getEntry(timestamp, carrier);
        CarrierVesselPortHistory history = null;
        if (historyOption.isEmpty()) {
            history = this.insertHistoryEntry(timestamp, carrier);
            log.info("For this combination of Port, Vessel and Carrier, a new history entry was created with id {}", history.getId());
        } else {
            history = historyOption.get();
            this.refreshLastUpdateDate(history.getId());
            log.info("For this combination an history entry exists with id {}", history.getId());
        }


        return history;

    }


    /**
     * Function that removes all entries from the database which have reached
     * a certain age defined in the configs
     */
    private void cleanUpHistory() {

        LocalDateTime removeDate = LocalDateTime.now().minusDays(this.config.getManagement().getCarrierVesselPortHistoryThresholdDays());
        log.debug("Cleaning up history, remove entries with lastUpdate before {}", removeDate.toString());
        this.dsl.delete(CARRIER_VESSEL_PORT_HISTORY)
                .where(CARRIER_VESSEL_PORT_HISTORY.LAST_UPDATE.le(removeDate));

    }

    public int getCarrierId(PortCallTimestamp timestamp){
        Record rec =  this.dsl.select()
                .from(CARRIER_VESSEL_PORT_HISTORY)
                .where(CARRIER_VESSEL_PORT_HISTORY.PORT_OF_CALL.eq(timestamp.getPortOfCall()))
                .and(CARRIER_VESSEL_PORT_HISTORY.PORT_NEXT.eq(timestamp.getPortNext()))
                .and(CARRIER_VESSEL_PORT_HISTORY.PORT_PREVIOUS.eq(timestamp.getPortPrevious()))
                .and(CARRIER_VESSEL_PORT_HISTORY.TERMINAL.eq(timestamp.getTerminal()))
                .and(CARRIER_VESSEL_PORT_HISTORY.VESSEL.eq(timestamp.getVessel()))
                .fetchOne();
        if(rec != null){
            return rec.get(CARRIER_VESSEL_PORT_HISTORY.CARRIER);
        } else {
            log.warn("Could not get CarrierID from history, there is no entry for combination of Port of Call {}, Port Next {}, Port Previous {}, Terminal {}, Vessel {}!",
                    timestamp.getPortOfCall(), timestamp.getPortNext(), timestamp.getPortPrevious(), timestamp.getTerminal(), timestamp.getVessel());
            return 0;
        }
    }

    /**
     *
     * Function that inserts a new history entry to the Database!
     */
    private CarrierVesselPortHistory insertHistoryEntry(PortCallTimestamp timestamp, Carrier carrier) {
        log.debug("Insert new history entry for Port Of Call: {}, Next Port: {}. Previous Port: {}, Terminal: {}, Vessel: {}, Carrier: {}",
                timestamp.getPortOfCall(), timestamp.getPortNext(), timestamp.getPortPrevious(), timestamp.getTerminal(),
                timestamp.getVessel(), carrier.getId());

        CarrierVesselPortHistory history = new CarrierVesselPortHistory();
        history.setCarrier(carrier.getId());
        history.setPortOfCall(timestamp.getPortOfCall());
        history.setPortNext(timestamp.getPortNext());
        history.setPortPrevious(timestamp.getPortPrevious());
        history.setTerminal(timestamp.getTerminal());
        history.setVessel(timestamp.getVessel());
        Record2<?, ?> record =
                 this.dsl.insertInto(CARRIER_VESSEL_PORT_HISTORY,
                        CARRIER_VESSEL_PORT_HISTORY.PORT_OF_CALL,
                        CARRIER_VESSEL_PORT_HISTORY.PORT_NEXT,
                        CARRIER_VESSEL_PORT_HISTORY.PORT_PREVIOUS,
                        CARRIER_VESSEL_PORT_HISTORY.TERMINAL,
                        CARRIER_VESSEL_PORT_HISTORY.VESSEL,
                        CARRIER_VESSEL_PORT_HISTORY.CARRIER)
                .values(history.getPortOfCall(), history.getPortNext(), history.getPortPrevious(),
                        history.getTerminal(), history.getVessel(), carrier.getId())
                .returningResult(
                        CARRIER_VESSEL_PORT_HISTORY.ID,
                        CARRIER_VESSEL_PORT_HISTORY.LAST_UPDATE)
                .fetchOne();


        history.setId(record.get(CARRIER_VESSEL_PORT_HISTORY.ID));
        history.setLastUpdate(record.get(CARRIER_VESSEL_PORT_HISTORY.LAST_UPDATE));


        return history;
    }

    /**
     * Function that returns an existing CarrierVesselPortHistory entry for a given
     * Port of Call, Previous Port, Next Port, Terminal, Vessel and Carrier
     */
    public Optional<CarrierVesselPortHistory> getEntry(PortCallTimestamp timestamp, Carrier carrier) {
        log.debug("Loading History for Port Of Call: {}, Next Port: {}. Previous Port: {}, Terminal: {}, Vessel: {}, Carrier: {}",
                timestamp.getPortOfCall(), timestamp.getPortNext(), timestamp.getPortPrevious(), timestamp.getTerminal(),
                timestamp.getVessel(), carrier.getId());

        Record histroy = dsl.select()
                .from(CARRIER_VESSEL_PORT_HISTORY)
                .where(CARRIER_VESSEL_PORT_HISTORY.PORT_OF_CALL.eq(timestamp.getPortOfCall()))
                .and(CARRIER_VESSEL_PORT_HISTORY.PORT_NEXT.eq(timestamp.getPortNext()))
                .and(CARRIER_VESSEL_PORT_HISTORY.PORT_PREVIOUS.eq(timestamp.getPortPrevious()))
                .and(CARRIER_VESSEL_PORT_HISTORY.TERMINAL.eq(timestamp.getTerminal()))
                .and(CARRIER_VESSEL_PORT_HISTORY.VESSEL.eq(timestamp.getVessel()))
                .and(CARRIER_VESSEL_PORT_HISTORY.CARRIER.eq(carrier.getId()))
                .fetchOne();

        if (histroy != null) {
            log.debug("Found history entry for port call process having id {}", histroy.get("id"));
            return Optional.of(histroy.into(CarrierVesselPortHistory.class));
        } else {
            return Optional.empty();
        }
    }

    /**
     * Function that updates the LastUpdate time, in oder to keep the PortCall List up to date.
     * This should happen, when ever there is a new timestamp for a portCall process at a certain port
     * for a vessel of a carrier
     */
    private void refreshLastUpdateDate(int historyID){
        log.info("Refreshing lastUpdate for Carrier_Vessel_Port_History id = {}",historyID);
        this.dsl.update(CARRIER_VESSEL_PORT_HISTORY)
                .set(CARRIER_VESSEL_PORT_HISTORY.LAST_UPDATE, LocalDateTime.now())
                .where(CARRIER_VESSEL_PORT_HISTORY.ID.eq(historyID));

            }
}