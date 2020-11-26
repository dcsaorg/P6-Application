package org.dcsa.portcall.service;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.dcsa.portcall.db.enums.PortCallTimestampType;
import org.dcsa.portcall.db.tables.pojos.Port;
import org.dcsa.portcall.db.tables.pojos.PortCallTimestamp;
import org.dcsa.portcall.db.tables.pojos.Terminal;
import org.dcsa.portcall.db.tables.pojos.Vessel;
import org.dcsa.portcall.message.*;
import org.dcsa.portcall.service.persistence.MessageService;
import org.dcsa.portcall.service.persistence.PortService;
import org.dcsa.portcall.service.persistence.TerminalService;
import org.dcsa.portcall.service.persistence.VesselService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class InboundPortCallMessageService extends AbstractPortCallMessageService<DCSAMessage<PortCallMessage>, PortCallTimestamp> {

    private static final Logger log = LogManager.getLogger(InboundPortCallMessageService.class);

    private PortService portService;
    private TerminalService terminalService;
    private VesselService vesselService;
    private MessageService messageService;

    public InboundPortCallMessageService(PortService portService,
                                         TerminalService terminalService,
                                         VesselService vesselService,
                                         MessageService messageService) {
        this.portService = portService;
        this.terminalService = terminalService;
        this.vesselService = vesselService;
        this.messageService = messageService;
    }

    @Override
    public Optional<PortCallTimestamp> process(DCSAMessage<PortCallMessage> message) {
        if (message == null) {
            return Optional.empty();
        }

        PortCallTimestamp timestamp = new PortCallTimestamp();

        if (CodeType.IMO_VESSEL_NUMBER.equals(message.getPayload().getVesselIdType())) {
            Optional<Vessel> vessel = vesselService.findVesselByIMO(Integer.parseInt(message.getPayload().getVesselId()));
            if (vessel.isPresent()) {
                timestamp.setVessel(vessel.get().getId());
            } else {
                log.debug("No vessel with imo '{}' found. Storing new vessel for carrier '{}'", message.getPayload().getVesselId(), "?");
                // TODO: Implement adding of unknown vessels
            }
        } else {
            throw new IllegalArgumentException("Unexpected vessel id type: " + message.getPayload().getVesselIdType());
        }

        timestamp.setVesselServiceName(message.getPayload().getVoyageNumber());

        if (CodeType.UN_LOCODE.equals(message.getPayload().getPortIdType())) {
            Optional<Port> portOfCall = portService.findPortByUnLocode(message.getPayload().getPortId());
            if (portOfCall.isPresent()) {
                timestamp.setPortOfCall(portOfCall.get().getId());
            } else {
                String msg = String.format("Unknown port of call '%s' with id type '%s'", message.getPayload().getPortId(), message.getPayload().getPortIdType());
                log.error(msg);
                throw new IllegalArgumentException(msg);
            }

            Optional<Port> portNext = portService.findPortByUnLocode(message.getPayload().getNextPortOfCall());
            if (portNext.isPresent()) {
                timestamp.setPortNext(portNext.get().getId());
            } else {
                String msg = String.format("Unknown next port of call '%s' with id type '%s'", message.getPayload().getNextPortOfCall(), message.getPayload().getPortIdType());
                log.error(msg);
                throw new IllegalArgumentException(msg);
            }

            Optional<Port> portPrevious = portService.findPortByUnLocode(message.getPayload().getPreviousPortOfCall());
            if (portPrevious.isPresent()) {
                timestamp.setPortPrevious(portPrevious.get().getId());
            } else {
                String msg = String.format("Unknown previous port of call '%s' with id type '%s'", message.getPayload().getPreviousPortOfCall(), message.getPayload().getPortIdType());
                log.error(msg);
                throw new IllegalArgumentException(msg);
            }
        } else {
            throw new IllegalArgumentException("Unexpected port id type: " + message.getPayload().getPortIdType());
        }

        timestamp.setTimestampType(identifyTimestampType(message.getPayload().getEvent().getLocationType(), message.getPayload().getEvent().getTransportEventTypeCode(), message.getPayload().getEvent().getEventClassifierCode()));

        timestamp.setEventTimestamp(message.getPayload().getEvent().getEventDateTime());
        timestamp.setLogOfTimestamp(message.getMessageDateTime());

        if (CodeType.TERMINAL.equals(message.getPayload().getTerminalIdType())) {
            Optional<Terminal> terminal = terminalService.findTerminalByPortIdAndSMDGCode(timestamp.getPortOfCall(), message.getPayload().getTerminalId());
            if (terminal.isPresent()) {
                timestamp.setTerminal(terminal.get().getId());
            } else {
                String msg = String.format("Unknown terminal '%s' with id type '%s'", message.getPayload().getTerminalId(), message.getPayload().getTerminalIdType());
                log.error(msg);
                throw new IllegalArgumentException(msg);
            }
        } else {
            throw new IllegalArgumentException("Unexpected terminal id type: " + message.getPayload().getTerminalIdType());
        }

        timestamp.setLocationId(message.getPayload().getEvent().getLocationId());
        timestamp.setChangeComment(message.getPayload().getRemarks());


        return Optional.of(timestamp);
    }

    @SuppressWarnings("SwitchStatementWithTooFewBranches")
    public static PortCallTimestampType identifyTimestampType(LocationType locationType, TransportEventType transportEventTypeCode, EventClassifierCode eventClassifierCode) {
        switch (locationType) {
            case BERTH:
                switch (transportEventTypeCode) {
                    case ARRI:
                        switch (eventClassifierCode) {
                            case EST:
                                return PortCallTimestampType.ETA_Berth;
                            case REQ:
                                return PortCallTimestampType.RTA_Berth;
                            case PLA:
                                return PortCallTimestampType.PTA_Berth;
                            case ACT:
                                return PortCallTimestampType.ATA_Berth;
                            default:
                                throw new IllegalStateException("Unsupported event classifier '" + eventClassifierCode +
                                        "' with transport event type '" + transportEventTypeCode +
                                        "' with location type '" + locationType + "'");
                        }
                    case DEPT:
                        switch (eventClassifierCode) {
                            case EST:
                                return PortCallTimestampType.ETD_Berth;
                            case REQ:
                                return PortCallTimestampType.RTD_Berth;
                            case PLA:
                                return PortCallTimestampType.PTD_Berth;
                            case ACT:
                                return PortCallTimestampType.ATD_Berth;
                            default:
                                throw new IllegalStateException("Unsupported event classifier '" + eventClassifierCode +
                                        "' with transport event type '" + transportEventTypeCode +
                                        "' with location type '" + locationType + "'");
                        }
                    default:
                        throw new IllegalStateException("Unsupported transport event type '" + transportEventTypeCode +
                                "' with location type '" + locationType + "'");
                }
            case PORT:
                switch (transportEventTypeCode) {
                    case COPS:
                        switch (eventClassifierCode) {
                            case EST:
                                return PortCallTimestampType.ETC_Cargo_Ops;
                            case REQ:
                                return PortCallTimestampType.RTC_Cargo_Ops;
                            case PLA:
                                return PortCallTimestampType.PTC_Cargo_Ops;
                            case ACT:
                                return PortCallTimestampType.ATC_Cargo_Ops;
                            default:
                                throw new IllegalStateException("Unsupported event classifier '" + eventClassifierCode +
                                        "' with transport event type '" + transportEventTypeCode +
                                        "' with location type '" + locationType + "'");
                        }
                    default:
                        throw new IllegalStateException("Unsupported transport event type '" + transportEventTypeCode +
                                "' with location type '" + locationType + "'");
                }
            case PILOT_BOARDING_AREA:
                switch (transportEventTypeCode) {
                    case ARRI:
                        switch (eventClassifierCode) {
                            case EST:
                                return PortCallTimestampType.ETA_PBP;
                            case REQ:
                                return PortCallTimestampType.RTA_PBP;
                            case PLA:
                                return PortCallTimestampType.PTA_PBP;
                            case ACT:
                                return PortCallTimestampType.ATA_PBP;
                            default:
                                throw new IllegalStateException("Unsupported event classifier '" + eventClassifierCode +
                                        "' with transport event type '" + transportEventTypeCode +
                                        "' with location type '" + locationType + "'");
                        }
                    default:
                        throw new IllegalStateException("Unsupported transport event type '" + transportEventTypeCode +
                                "' with location type '" + locationType + "'");
                }
            default:
                throw new IllegalStateException("Unsupported location type: " + locationType);
        }
    }
}
