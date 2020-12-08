package org.dcsa.portcall.service;

import com.fasterxml.jackson.core.type.TypeReference;
import de.ponton.xp.adapter.api.domainvalues.InboundStatusEnum;
import de.ponton.xp.adapter.api.messages.InboundMessage;
import de.ponton.xp.adapter.api.messages.InboundMessageStatusUpdate;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.dcsa.portcall.db.enums.PortCallTimestampType;
import org.dcsa.portcall.db.tables.pojos.*;
import org.dcsa.portcall.message.*;
import org.dcsa.portcall.service.persistence.*;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.util.Optional;

@Service
public class InboundPortCallMessageService extends AbstractPortCallMessageService<DCSAMessage<PortCallMessage>, PortCallTimestamp> {

    private static final Logger log = LogManager.getLogger(InboundPortCallMessageService.class);

    private final PortService portService;
    private final TerminalService terminalService;
    private final CarrierService carrierService;
    private final VesselService vesselService;
    private final PortCallTimestampService timestampService;
    private final PontonXPCommunicationService communicationService;
    private final MessageService messageService;

    public InboundPortCallMessageService(PortService portService,
                                         TerminalService terminalService,
                                         CarrierService carrierService,
                                         VesselService vesselService,
                                         PortCallTimestampService timestampService,
                                         PontonXPCommunicationService communicationService,
                                         MessageService messageService) {
        this.portService = portService;
        this.terminalService = terminalService;
        this.carrierService = carrierService;
        this.vesselService = vesselService;
        this.timestampService = timestampService;
        this.communicationService = communicationService;
        this.messageService = messageService;
    }

    @PostConstruct
    public void initialize() {
        this.communicationService.registerInboundMessageProcessor(this::readAndProcessMessage);
    }

    private InboundMessageStatusUpdate readAndProcessMessage(InboundMessage xpMessage, Message message) {
        try {
            DCSAMessage<PortCallMessage> dcsaMessage = getJsonMapper().readValue(message.getPayload(), new TypeReference<>() {});
            if (dcsaMessage != null && dcsaMessage.getPayload() != null) {
                if (MessageType.PortCallMessage.equals(dcsaMessage.getMessageType())) {

                    Optional<PortCallTimestamp> timestamp = process(dcsaMessage);
                    if (timestamp.isPresent()) {
                        timestampService.addTimestamp(timestamp.get(), false);
                        messageService.updatePortCallTimestampId(message.getId(), timestamp.get().getId());
                        return InboundMessageStatusUpdate.newBuilder()
                                .setInboundMessage(xpMessage)
                                .setStatus(InboundStatusEnum.SUCCESS)
                                .setStatusText("Inbound message successfully processed as DCSA port call message.")
                                .build();
                    }
                }
            }

        } catch (IOException e) {
            log.fatal("Could not read json message", e);
        }

        return InboundMessageStatusUpdate.newBuilder()
                .setInboundMessage(xpMessage)
                .setStatus(InboundStatusEnum.REJECTED)
                .setStatusText("Inbound message could not be processed.")
                .build();
    }

    @Override
    public Optional<PortCallTimestamp> process(DCSAMessage<PortCallMessage> message) {
        if (message == null) {
            return Optional.empty();
        }

        PortCallTimestamp timestamp = new PortCallTimestamp();
        // Received timestamp cannot be modified / deleted
        timestamp.setModifiable(false);

        if (CodeType.IMO_VESSEL_NUMBER.equals(message.getPayload().getVesselIdType())) {
            int vesselImo = Integer.parseInt(message.getPayload().getVesselId());
            Optional<Vessel> vessel = vesselService.findVesselByIMO(vesselImo);
            if (vessel.isPresent()) {
                timestamp.setVessel(vessel.get().getId());
            } else if (RoleType.CARRIER.equals(message.getSenderRole())) {
                log.debug("No vessel with imo '{}' found. Storing new vessel for carrier '{}'", message.getPayload().getVesselId(), message.getSenderId());
                Optional<Carrier> carrier = carrierService.findBySMDGCode(message.getSenderId().toUpperCase());
                if (carrier.isPresent()) {
                    Vessel newVessel = new Vessel().setCarrier(carrier.get().getId()).setName(carrier.get().getSmdgCode() + " " + vesselImo).setImo(vesselImo).setTeu((short) 0);
                    vesselService.addVessel(newVessel);
                    timestamp.setVessel(newVessel.getId());
                } else {
                    String msg = String.format("Could not add vessel with imo '%s' because not carrier with id '%s' found", message.getPayload().getVesselId(), message.getSenderId());
                    log.fatal(msg);
                    throw new IllegalArgumentException(msg);
                }
            } else {
                String msg = String.format("Could not add vessel with imo '%s' because sender is not a carrier '%s:%s:%s'",
                        message.getPayload().getVesselId(), message.getSenderRole(), message.getSenderIdType(), message.getSenderId());
                log.fatal(msg);
                throw new IllegalArgumentException(msg);
            }
        } else {
            throw new IllegalArgumentException("Unexpected vessel id type: " + message.getPayload().getVesselIdType());
        }

        timestamp.setVesselServiceName(message.getPayload().getVoyageNumber());

        if (CodeType.UN_LOCODE.equals(message.getPayload().getPortIdType())) {
            Optional<Port> portOfCall = portService.findPortByUnLocode(message.getPayload().getPortId().toUpperCase());
            if (portOfCall.isPresent()) {
                timestamp.setPortOfCall(portOfCall.get().getId());
            } else {
                String msg = String.format("Unknown port of call '%s' with id type '%s'", message.getPayload().getPortId(), message.getPayload().getPortIdType());
                log.error(msg);
                throw new IllegalArgumentException(msg);
            }

            Optional<Port> portNext = portService.findPortByUnLocode(message.getPayload().getNextPortOfCall().toUpperCase());
            if (portNext.isPresent()) {
                timestamp.setPortNext(portNext.get().getId());
            } else {
                String msg = String.format("Unknown next port of call '%s' with id type '%s'", message.getPayload().getNextPortOfCall(), message.getPayload().getPortIdType());
                log.error(msg);
                throw new IllegalArgumentException(msg);
            }

            Optional<Port> portPrevious = portService.findPortByUnLocode(message.getPayload().getPreviousPortOfCall().toUpperCase());
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

        if (CodeType.UN_LOCODE.equals(message.getPayload().getTerminalIdType())) {
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

        String locationId = message.getPayload().getEvent().getLocationId();
        if (locationId.contains(":")) {
            timestamp.setLocationId(locationId.substring(locationId.lastIndexOf(":") + 1));
        } else {
            timestamp.setLocationId(locationId);
        }

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
                    case SOPS:
                        switch (eventClassifierCode) {
                            case ACT:
                                return PortCallTimestampType.ATS;
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
