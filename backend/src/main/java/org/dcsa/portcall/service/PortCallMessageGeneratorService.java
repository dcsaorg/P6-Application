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
        log.info("Generate new PortCall Message");
        this.generateMessageHeader(message);

        this.storeMessage(message);

        return message;
    }

    private void generateMessageHeader(DCSAMessage message) {
        log.debug("Generate message header");
        message.setMessageDateTime(OffsetDateTime.now());
        message.setSenderRole(this.config.getSenderRole());
        message.setSenderIdType(this.config.getSenderIdType());

        String portOfCall = this.getPortById(timestamp.getPortOfCall()).getUnLocode();
        String terminal = this.getTerminalById(timestamp.getTerminal()).getSmdgCode();
        message.setSenderId(this.config.getSenderId());

        //@ToDo Calculate Receiver Role Code and ID by TimeStamp Type
        message.setReceiverRole(RoleType.TERMINAL);
        message.setReceiverIdType(CodeType.UN_LOCODE);
        String receiverId = portOfCall +
                ":" +
                terminal;
        message.setReceiverId(receiverId);

        message.setProcessType(ProcessType.PortCall);
        message.setProcessId(this.generateUUID());
        message.setMessageType(MessageType.PortCallMessage);
        // Add Payload
        message.setPayload(this.generatePortCallMessage(portOfCall, terminal));

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


    private PortCallEvent generatePortCallEvent(String portOfCall, String terminal) {
        PortCallEvent event = new PortCallEvent();
        event.setEventClassifierCode(PortcallTimestampTypeMapping.getEventClassifierCodeForTimeStamp(timestamp.getTimestampType()));
        event.setTransportEventTypeCode(PortcallTimestampTypeMapping.getTransPortEventTypeForTimestamp(timestamp.getTimestampType()));
        //@ToDo Swicth between option One and Two (Service Event / Location Event)
        event.setLocationType(PortcallTimestampTypeMapping.getLocationCodeForTimeStampType(timestamp.getTimestampType()));
        String location = String.format("urn:mrn:ipcdmc:location:%s:berth:%s:%s",
               portOfCall,terminal,this.timestamp.getLocationId());
        event.setLocationId(location);
        //@ToDo check correct Timezone
        event.setEventDateTime(this.timestamp.getEventTimestamp());
        return event;
    }

    private String generateComment() {
        if (this.timestamp.getDelayCode() != null) {
            String comment = String.format("%s: %s", this.getDelayCodeById(this.timestamp.getDelayCode()).getSmdgCode(),
                    this.timestamp.getChangeComment());
            return comment;
        } else {
            return this.timestamp.getChangeComment();
        }
    }

    private void storeMessage(DCSAMessage message) {
        log.debug("New {} PortCall Message will be stored to File System", timestamp.getTimestampType());
        try {
            PortCallMessageService pcms = new PortCallMessageService();
            ObjectMapper mapper = pcms.getJsonMapper();
            Path path = Paths.get(this.config.getHotfolder().getOutbox() + this.generateMessagFileName(message));
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
