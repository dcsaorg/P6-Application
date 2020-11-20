package org.dcsa.portcall.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.dcsa.portcall.PortCallProperties;
import org.dcsa.portcall.controller.*;
import org.dcsa.portcall.db.enums.PortCallTimestampType;
import org.dcsa.portcall.db.tables.pojos.*;
import org.dcsa.portcall.message.*;
import org.dcsa.portcall.util.PortcallTimestampTypeMapping;
import org.jooq.DSLContext;
import org.springframework.http.HttpStatus;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.OffsetDateTime;
import java.util.UUID;

public class PortCallMessageGeneratorService {

    private static final Logger log = LogManager.getLogger(PortCallMessageGeneratorService.class);
    private PortCallTimestamp timestamp;
    private DSLContext dsl;
    private PortCallProperties config;


    public PortCallMessageGeneratorService(PortCallTimestamp timestamp, PortCallProperties config, DSLContext dsl) {
        this.timestamp = timestamp;
        this.dsl = dsl;
        this.config = config;
    }


    /**
     * @return DCSAMessage
     * <p>
     * generates a new DCSA Message by the handed over PortCallTimeStamp
     */
    public DCSAMessage generate() {
        DCSAMessage message = new DCSAMessage();
        // Generate Message Header
        log.info("Generate new PortCall Message for timestamp type {}", this.timestamp.getTimestampType());

        // Get PortOfCall and Terminal
        String portOfCall = this.getPortById(timestamp.getPortOfCall()).getUnLocode();
        String terminal = this.getTerminalById(timestamp.getTerminal()).getSmdgCode();

        // Generate MessageHeader
        this.generateMessageHeader(message, portOfCall, terminal);

        // Add Payload
        message.setPayload(this.generatePortCallMessage(portOfCall, terminal));

        if(this.documentCreationRequired(message)) {
            this.storeMessage(message);
        } else {
            log.warn("No document was stored, sender is {}, receiver is {}!", message.getSenderRole(), message.getReceiverRole());
        }


        return message;
    }

    private void generateMessageHeader(DCSAMessage message, String portOfCall, String terminal) {
        log.debug("Generate message header");
        message.setMessageDateTime(OffsetDateTime.now());
        message.setSenderRole(this.config.getSenderRole());
        message.setSenderIdType(this.config.getSenderIdType());


        message.setSenderId(this.config.getSenderId());
        // Identify the Receiver as of selected Timestamp
        this.identifyReceiver(message, portOfCall, terminal);
        message.setProcessType(ProcessType.PortCall);
        message.setProcessId(this.generateUUID());
        message.setMessageType(MessageType.PortCallMessage);



    }

    private PortCallMessage generatePortCallMessage(String portOfCall, String terminal) {
        PortCallMessage pcm = new PortCallMessage();
        pcm.setVesselIdType(CodeType.IMO_VESSEL_NUMBER);
        pcm.setVesselId(Integer.toString(this.getVesselById(this.timestamp.getVessel()).getImo()));
        pcm.setPortIdType(CodeType.UN_LOCODE);
        pcm.setPortId(portOfCall);
        pcm.setTerminalIdType(CodeType.TERMINAL);
        pcm.setTerminalId(terminal);
        pcm.setPreviousPortOfCall(this.getPortById(this.timestamp.getPortPrevious()).getUnLocode());
        pcm.setNextPortOfCall(this.getPortById(this.timestamp.getPortNext()).getUnLocode());
        pcm.setVoyageNumber(this.timestamp.getVesselServiceName());
        pcm.setEvent(this.generatePortCallEvent(portOfCall, terminal));
        pcm.setRemarks(this.generateComment());

        return pcm;
    }

    /**
     *
     * Checks if it is necessary to generate a document or not, in case sender and receiver are the same, no document need to be generated!
     *
     * @return boolean
     */

    private boolean documentCreationRequired(DCSAMessage message){
        if(message.getSenderRole() == message.getReceiverRole()){
            return false;
        } else {
            return true;
        }

    }


    /**
     * Sets receiver role, IdType and ID as of selected timestamp
     * @param message
     */
    private void identifyReceiver(DCSAMessage message, String portOfCall, String terminal){
        RoleType receiverRole = null;
        CodeType receiverIdType = null;
        String receiverId = null;

        PortCallTimestampType type = this.timestamp.getTimestampType();

        // Receiver is the Terminal
        if(type == PortCallTimestampType.ETA_Berth ||
           type == PortCallTimestampType.PTA_Berth ||
           type == PortCallTimestampType.ATA_Berth ||
           type == PortCallTimestampType.RTC_Cargo_Ops ||
           type == PortCallTimestampType.ATD_Berth){

            receiverRole = RoleType.TERMINAL;
            receiverIdType = CodeType.TERMINAL;
            receiverId = portOfCall +
                    ":" +
                    terminal;
        }
        // Receiver is Carrier
        else if(type == PortCallTimestampType.RTA_Berth ||
                type == PortCallTimestampType.RTA_PBP ||
                type == PortCallTimestampType.ATS ||
                type == PortCallTimestampType.ETC_Cargo_Ops ||
                type == PortCallTimestampType.PTC_Cargo_Ops ||
                type == PortCallTimestampType.RTD_Berth ||
                type == PortCallTimestampType.ATC_Cargo_Ops){

            receiverRole = RoleType.CARRIER;
            receiverIdType = CodeType.SMDG_LINER_CODE;
            receiverId = "N/A";
        }

        // Receiver is Port
        else if(type == PortCallTimestampType.ETA_PBP ||
                type == PortCallTimestampType.PTA_PBP ||
                type == PortCallTimestampType.ATA_PBP ||
                type == PortCallTimestampType.ETD_Berth ||
                type == PortCallTimestampType.PTD_Berth){

            receiverRole = RoleType.PORT;
            receiverIdType = CodeType.UN_LOCODE;
            receiverId = portOfCall;
        }

        message.setReceiverRole(receiverRole);
        message.setReceiverIdType(receiverIdType);
        message.setReceiverId(receiverId);
    }

    private PortCallEvent generatePortCallEvent(String portOfCall, String terminal) {
        PortCallEvent event = new PortCallEvent();
        event.setEventClassifierCode(PortcallTimestampTypeMapping.getEventClassifierCodeForTimeStamp(timestamp.getTimestampType()));
        event.setTransportEventTypeCode(PortcallTimestampTypeMapping.getTransPortEventTypeForTimestamp(timestamp.getTimestampType()));
        //@ToDo Swicth between option One and Two (Service Event / Location Event)
        event.setLocationType(PortcallTimestampTypeMapping.getLocationCodeForTimeStampType(timestamp.getTimestampType()));
        String location = String.format("urn:mrn:ipcdmc:location:%s:berth:%s:%s",
                portOfCall, terminal, this.timestamp.getLocationId());
        event.setLocationId(location);
        //@ToDo check correct Timezone
        event.setEventDateTime(this.timestamp.getEventTimestamp());
        return event;

    }

    /**
     * Generates comment for the remark field as of filled values in timestamp generator
     * @return String
     */

    private String generateComment() {
        if (this.timestamp.getDelayCode() != null) {
            String comment = String.format("%s: %s", this.getDelayCodeById(this.timestamp.getDelayCode()).getSmdgCode(),
                    this.timestamp.getChangeComment());
            return comment;
        } else {
            return this.timestamp.getChangeComment();
        }
    }

    /**
     * store the Message to the FileSystem to the define output folder set as hotfolder/outbox
     *  @param message
     *
     */

    private void storeMessage(DCSAMessage message) {
        log.debug("New {} PortCall Message will be stored to File System", timestamp.getTimestampType());
        try {
            PortCallMessageService pcms = new PortCallMessageService();
            ObjectMapper mapper = pcms.getJsonMapper();
            Path path = Paths.get(this.config.getHotfolder().getOutbox(), this.generateMessagFileName(message));
            log.info("{} PortCall Message will be saved to: {}", timestamp.getTimestampType(), path.toString());
            mapper.writeValue(Paths.get(path.toString()).toFile(), message);
            log.info("Message successfully saved!");

        } catch (IOException e) {
            String msg = String.format("Error saving new PortCallMessage:  %s ", e.getMessage());
            log.error(msg);
            e.printStackTrace();
            PortCallException portCallException = new PortCallException(HttpStatus.INTERNAL_SERVER_ERROR, msg);
            throw portCallException;
        }
    }

    private String generateMessagFileName(DCSAMessage message) {
        // Filename {ProcessId}@{SENDER_ID}.JSON
        String fileName = message.getProcessId() + "@" + this.config.getSenderId() + ".json";
        return fileName;

    }


    /**
     * @param portId
     * @return Port
     * <p>
     * Load Port from Database by ID
     */

    private Port getPortById(int portId) {
        PortController pc = new PortController(this.dsl);
        return pc.getPortById(portId);
    }

    /**
     * @param vesselId
     * @return Vessel
     * <p>
     * Load Vessel from Database by ID
     */
    private Vessel getVesselById(int vesselId) {
        VesselController vc = new VesselController(this.dsl);
        return vc.getVessel(vesselId);
    }

    /**
     * @param terminalId
     * @return Terminal
     * <p>
     * Load Terminal from Database by ID
     */
    private Terminal getTerminalById(int terminalId) {
        TerminalController tc = new TerminalController(this.dsl);
        return tc.getTerminalById(terminalId);
    }

    /**
     * @param delayCodeId
     * @return Load DelayCode from Database by ID
     */

    private DelayCode getDelayCodeById(int delayCodeId) {
        DelayCodeController dc = new DelayCodeController(this.dsl);
        return dc.getDelayCode(delayCodeId);
    }

    private String generateUUID() {
        return UUID.randomUUID().toString();
    }

}
