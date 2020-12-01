package org.dcsa.portcall.service;

import de.ponton.xp.adapter.api.TransmissionException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.dcsa.portcall.PortCallProperties;
import org.dcsa.portcall.controller.PortCallException;
import org.dcsa.portcall.db.enums.MessageDirection;
import org.dcsa.portcall.db.enums.PortCallTimestampType;
import org.dcsa.portcall.db.tables.pojos.Carrier;
import org.dcsa.portcall.db.tables.pojos.Message;
import org.dcsa.portcall.db.tables.pojos.PortCallTimestamp;
import org.dcsa.portcall.message.*;
import org.dcsa.portcall.service.persistence.*;
import org.dcsa.portcall.util.PortcallTimestampTypeMapping;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class OutboundPortCallMessageService extends AbstractPortCallMessageService<PortCallTimestamp, DCSAMessage<PortCallMessage>> {

    private static final Logger log = LogManager.getLogger(OutboundPortCallMessageService.class);

    private final PortCallProperties config;
    private final PortService portService;
    private final DelayCodeService delayCodeService;
    private final TerminalService terminalService;
    private final VesselService vesselService;
    private final CarrierService carrierService;
    private final MessageService messageService;
    private final PontonXPCommunicationService communicationService;

    public OutboundPortCallMessageService(PortCallProperties config,
                                          DelayCodeService delayCodeService,
                                          PortService portService,
                                          TerminalService terminalService,
                                          VesselService vesselService,
                                          CarrierService carrierService,
                                          MessageService messageService,
                                          PontonXPCommunicationService communicationService) {
        this.config = config;
        this.delayCodeService = delayCodeService;
        this.portService = portService;
        this.terminalService = terminalService;
        this.vesselService = vesselService;
        this.carrierService = carrierService;
        this.messageService = messageService;
        this.communicationService = communicationService;
    }


    /**
     * generates a new DCSA Message by the handed over PortCallTimeStamp
     */
    @Override
    public Optional<DCSAMessage<PortCallMessage>> process(PortCallTimestamp timestamp) {

        DCSAMessage<PortCallMessage> dcsaMessage = new DCSAMessage<>();

        // Identify a carrier for this portCall process!
        Carrier carrier = carrierService.findCarrierByVesselId(timestamp.getVessel()).get();

        // Generate Message Header
        log.info("Generate new PortCall Message for timestamp type {}", timestamp.getTimestampType());

        // Get PortOfCall and Terminal
        String portOfCall = portService.findPortById(timestamp.getPortOfCall()).get().getUnLocode();
        String terminal = terminalService.findTerminalById(timestamp.getTerminal()).get().getSmdgCode();

        // Generate MessageHeader
        this.generateMessageHeader(timestamp, dcsaMessage, portOfCall, terminal, carrier);

        // Add Payload
        dcsaMessage.setPayload(this.generatePortCallMessage(timestamp, portOfCall, terminal));

        //Save Message
        if (this.documentCreationRequired(dcsaMessage)) {
            Optional<Message> message = this.storeMessage(timestamp, dcsaMessage);
            try {
                communicationService.sendMessage(dcsaMessage.getSenderId(), dcsaMessage.getReceiverId(), message.get());
            } catch (TransmissionException e) {
                log.fatal("Could not send message", e);
            }
        } else {
            log.warn("No document was stored, sender is {}, receiver is {}!", dcsaMessage.getSenderRole(), dcsaMessage.getReceiverRole());
        }


        return Optional.of(dcsaMessage);
    }

    private void generateMessageHeader(PortCallTimestamp timestamp, DCSAMessage<PortCallMessage> message, String portOfCall, String terminal, Carrier carrier) {
        log.debug("Generate message header");
        message.setMessageDateTime(OffsetDateTime.now());
        message.setSenderRole(this.config.getSenderRole());
        message.setSenderIdType(this.config.getSenderIdType());

        message.setSenderId(this.config.getSenderId());
        // Identify the Receiver as of selected Timestamp
        this.identifyReceiver(timestamp, message, portOfCall, terminal, carrier);
        message.setProcessType(ProcessType.PortCall);
        message.setProcessId(UUID.randomUUID().toString());
        message.setMessageType(MessageType.PortCallMessage);


    }

    private PortCallMessage generatePortCallMessage(PortCallTimestamp timestamp, String portOfCall, String terminal) {
        PortCallMessage pcm = new PortCallMessage();
        pcm.setVesselIdType(CodeType.IMO_VESSEL_NUMBER);
        pcm.setVesselId(Integer.toString(vesselService.findVesselById(timestamp.getVessel()).get().getImo()));
        pcm.setPortIdType(CodeType.UN_LOCODE);
        pcm.setPortId(portOfCall);
        pcm.setTerminalIdType(CodeType.TERMINAL);
        pcm.setTerminalId(terminal);
        pcm.setPreviousPortOfCall(portService.findPortById(timestamp.getPortPrevious()).get().getUnLocode());
        pcm.setNextPortOfCall(portService.findPortById(timestamp.getPortNext()).get().getUnLocode());
        pcm.setVoyageNumber(timestamp.getVesselServiceName());
        pcm.setEvent(this.generatePortCallEvent(timestamp, portOfCall, terminal));
        pcm.setRemarks(this.generateComment(timestamp));

        return pcm;
    }

    /**
     * Checks if it is necessary to generate a document or not, in case sender and receiver are the same, no document need to be generated!
     */

    private boolean documentCreationRequired(DCSAMessage<PortCallMessage> message) {
        return message.getSenderRole() != message.getReceiverRole();
    }


    /**
     * Sets receiver role, IdType and ID as of selected timestamp
     */
    private void identifyReceiver(PortCallTimestamp timestamp, DCSAMessage<PortCallMessage> message, String portOfCall, String terminal, Carrier carrier) {
        RoleType receiverRole = null;
        CodeType receiverIdType = null;
        String receiverId = null;

        PortCallTimestampType type = timestamp.getTimestampType();

        // Receiver is the Terminal
        if (type == PortCallTimestampType.ETA_Berth ||
                type == PortCallTimestampType.PTA_Berth ||
                type == PortCallTimestampType.ATA_Berth ||
                type == PortCallTimestampType.RTC_Cargo_Ops ||
                type == PortCallTimestampType.ATD_Berth) {

            receiverRole = RoleType.TERMINAL;
            receiverIdType = CodeType.TERMINAL;
            receiverId = portOfCall +
                    ":" +
                    terminal;
        }
        // Receiver is Carrier
        else if (type == PortCallTimestampType.RTA_Berth ||
                type == PortCallTimestampType.RTA_PBP ||
                type == PortCallTimestampType.ATS ||
                type == PortCallTimestampType.ETC_Cargo_Ops ||
                type == PortCallTimestampType.PTC_Cargo_Ops ||
                type == PortCallTimestampType.RTD_Berth ||
                type == PortCallTimestampType.ATC_Cargo_Ops) {

            receiverRole = RoleType.CARRIER;
            receiverIdType = CodeType.SMDG_LINER_CODE;
            receiverId = carrier.getSmdgCode();
        }

        // Receiver is Port
        else if (type == PortCallTimestampType.ETA_PBP ||
                type == PortCallTimestampType.PTA_PBP ||
                type == PortCallTimestampType.ATA_PBP ||
                type == PortCallTimestampType.ETD_Berth ||
                type == PortCallTimestampType.PTD_Berth) {

            receiverRole = RoleType.PORT;
            receiverIdType = CodeType.UN_LOCODE;
            receiverId = portOfCall;
        }

        message.setReceiverRole(receiverRole);
        message.setReceiverIdType(receiverIdType);
        message.setReceiverId(receiverId);
    }


    private PortCallEvent generatePortCallEvent(PortCallTimestamp timestamp, String portOfCall, String terminal) {
        PortCallEvent event = new PortCallEvent();
        event.setEventClassifierCode(PortcallTimestampTypeMapping.getEventClassifierCodeForTimeStamp(timestamp.getTimestampType()));
        event.setTransportEventTypeCode(PortcallTimestampTypeMapping.getTransPortEventTypeForTimestamp(timestamp.getTimestampType()));
        //@ToDo Switch between option One and Two (Service Event / Location Event)
        event.setLocationType(PortcallTimestampTypeMapping.getLocationCodeForTimeStampType(timestamp.getTimestampType()));
        String location = String.format("urn:mrn:ipcdmc:location:%s:berth:%s:%s",
                portOfCall, terminal, timestamp.getLocationId());
        event.setLocationId(location);
        //@ToDo check correct Timezone
        event.setEventDateTime(timestamp.getEventTimestamp());
        return event;

    }

    /**
     * Generates comment for the remark field as of filled values in timestamp generator
     */

    private String generateComment(PortCallTimestamp timestamp) {
        if (timestamp.getDelayCode() != null) {
            return String.format("%s: %s", delayCodeService.findDelayCode(timestamp.getDelayCode()).get().getSmdgCode(),
                    timestamp.getChangeComment());
        } else {
            return timestamp.getChangeComment();
        }
    }

    /**
     * store the Message to the FileSystem to the define output folder set as hotfolder/outbox
     */
    private Optional<Message> storeMessage(PortCallTimestamp timestamp, DCSAMessage<PortCallMessage> dcsaMessage) {
        log.debug("New {} PortCall Message will be stored to file system", timestamp.getTimestampType());
        try {
            Path path = Paths.get(this.config.getHotfolder().getOutbox(), this.generateMessageFileName(dcsaMessage));
            log.info("{} PortCall Message will be saved to: {}", timestamp.getTimestampType(), path.toString());
            getJsonMapper().writeValue(Paths.get(path.toString()).toFile(), dcsaMessage);

            Optional<Message> message = messageService.saveMessage(timestamp.getId(), MessageDirection.outbound, path);
            log.info("Message successfully saved!");
            return message;
        } catch (IOException e) {
            String msg = String.format("Error saving new PortCallMessage:  %s ", e.getMessage());
            log.error(msg, e);
            throw new PortCallException(HttpStatus.INTERNAL_SERVER_ERROR, msg);
        }
    }

    private String generateMessageFileName(DCSAMessage<PortCallMessage> message) {
        // Filename {ProcessId}@{SENDER_ID}.JSON
        return message.getProcessId() + "@" + this.config.getSenderId() + ".json";

    }
}
