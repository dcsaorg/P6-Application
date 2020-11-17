package org.dcsa.portcall.message;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.dcsa.portcall.service.PortCallMessageService;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;

public class DCSAMessageJsonTest {

    private static ObjectMapper mapper;

    @BeforeAll
    static void before() {
        PortCallMessageService portCallMessageService = new PortCallMessageService();
        mapper = portCallMessageService.getJsonMapper();
    }

    @Test
    void testWriterEmptyHeaderWithoutMessage() throws JsonProcessingException {
        DCSAMessage<PortCallMessage> message = new DCSAMessage<>();
        String json = mapper.writeValueAsString(message);
        assertThat(json).isEqualTo("{\n" +
                "  \"DCSAMessage\" : {\n" +
                "    \"MessageDateTime\" : null,\n" +
                "    \"SenderRole\" : null,\n" +
                "    \"ReceiverRole\" : null,\n" +
                "    \"ProcessType\" : \"PortCall\",\n" +
                "    \"ProcessId\" : null,\n" +
                "    \"MessageType\" : \"PortCallMessage\"\n" +
                "  }\n" +
                "}");
    }

    @Test
    void testWriterFullHeaderWithoutMessage() throws JsonProcessingException {
        DCSAMessage<PortCallMessage> message = new DCSAMessage<>();
        message.setMessageDateTime(OffsetDateTime.of(2020, 11, 13, 17, 25, 31, 43, ZoneOffset.UTC))
                .setSenderRole(RoleType.VESSEL).setSenderId("9074729")
                .setReceiverRole(RoleType.TERMINAL).setReceiverId("deham:cta")
                .setGatewayId("PC-SERVICE")
                .setOtherReceiver(Collections.singletonList(new OtherParty().setOtherReceiverRole(RoleType.PILOT).setOtherReceiverId("NLRTM:PILOTSERVICE")))
                .setProcessId("MSC-ABCDEFGH");
        String json = mapper.writeValueAsString(message);
        assertThat(json).isEqualTo("{\n" +
                "  \"DCSAMessage\" : {\n" +
                "    \"MessageDateTime\" : \"2020-11-13T17:25Z\",\n" +
                "    \"SenderRole\" : \"VESSEL\",\n" +
                "    \"SenderIdType\" : \"IMO-VESSEL-NUMBER\",\n" +
                "    \"SenderId\" : \"9074729\",\n" +
                "    \"ReceiverRole\" : \"TERMINAL\",\n" +
                "    \"ReceiverIdType\" : \"UN/LOCODE\",\n" +
                "    \"ReceiverId\" : \"deham:cta\",\n" +
                "    \"GatewayId\" : \"PC-SERVICE\",\n" +
                "    \"OtherReceiver\" : [ {\n" +
                "      \"OtherReceiverRole\" : \"PILOT\",\n" +
                "      \"OtherReceiverIdType\" : \"PILOTCODE\",\n" +
                "      \"OtherReceiverId\" : \"NLRTM:PILOTSERVICE\"\n" +
                "    } ],\n" +
                "    \"ProcessType\" : \"PortCall\",\n" +
                "    \"ProcessId\" : \"MSC-ABCDEFGH\",\n" +
                "    \"MessageType\" : \"PortCallMessage\"\n" +
                "  }\n" +
                "}");
    }

    @Test
    public void testReadEmptyHeaderWithoutMessage() throws JsonProcessingException {
        DCSAMessage<PortCallMessage> message = mapper.readValue("{\n" +
                "  \"DCSAMessage\" : {\n" +
                "    \"MessageDateTime\" : null,\n" +
                "    \"SenderRole\" : null,\n" +
                "    \"SenderId\" : null,\n" +
                "    \"ReceiverRole\" : null,\n" +
                "    \"ReceiverId\" : null,\n" +
                "    \"ProcessType\" : \"PortCall\",\n" +
                "    \"ProcessId\" : null,\n" +
                "    \"MessageType\" : \"PortCallMessage\"\n" +
                "  }\n" +
                "}", new TypeReference<>() {
        });

        assertThat(message.getMessageDateTime()).isNull();
        assertThat(message.getSenderRole()).isNull();
        assertThat(message.getSenderId()).isNull();
        assertThat(message.getReceiverRole()).isNull();
        assertThat(message.getReceiverId()).isNull();
        assertThat(message.getProcessType()).isEqualTo(ProcessType.PortCall);
        assertThat(message.getProcessId()).isNull();
        assertThat(message.getMessageType()).isEqualTo(MessageType.PortCallMessage);
    }

    @Test
    public void testReadFullHeaderWithoutMessage() throws JsonProcessingException {
        DCSAMessage<PortCallMessage> message = mapper.readValue("{\n" +
                "  \"DCSAMessage\" : {\n" +
                "    \"MessageDateTime\" : \"2020-11-13T17:25Z\",\n" +
                "    \"SenderRole\" : \"VESSEL\",\n" +
                "    \"SenderIdType\" : \"IMO-VESSEL-NUMBER\",\n" +
                "    \"SenderId\" : \"9074729\",\n" +
                "    \"ReceiverRole\" : \"TERMINAL\",\n" +
                "    \"ReceiverIdType\" : \"UN/LOCODE\",\n" +
                "    \"ReceiverId\" : \"deham:cta\",\n" +
                "    \"GatewayId\" : \"PC-SERVICE\",\n" +
                "    \"OtherReceiver\" : [ {\n" +
                "      \"OtherReceiverRole\" : \"PILOT\",\n" +
                "      \"OtherReceiverIdType\" : \"PILOTCODE\",\n" +
                "      \"OtherReceiverId\" : \"NLRTM:PILOTSERVICE\"\n" +
                "    } ],\n" +
                "    \"ProcessType\" : \"PortCall\",\n" +
                "    \"ProcessId\" : \"MSC-ABCDEFGH\",\n" +
                "    \"MessageType\" : \"PortCallMessage\"\n" +
                "  }\n" +
                "}", new TypeReference<>() {
        });

        assertThat(message.getMessageDateTime()).isEqualTo(OffsetDateTime.of(2020, 11, 13, 17, 25, 0, 0, ZoneOffset.UTC));
        assertThat(message.getSenderRole()).isNull();
        assertThat(message.getSenderId()).isNull();
        assertThat(message.getReceiverRole()).isNull();
        assertThat(message.getReceiverId()).isNull();
        assertThat(message.getProcessType()).isEqualTo(ProcessType.PortCall);
        assertThat(message.getProcessId()).isNull();
        assertThat(message.getMessageType()).isEqualTo(MessageType.PortCallMessage);
    }

    @Test
    public void testWriterEmptyHeaderWithEmptyMessage() throws JsonProcessingException {
        PortCallMessage portCallMessage = new PortCallMessage();
        DCSAMessage<PortCallMessage> message = new DCSAMessage<PortCallMessage>()
                .setPayload(portCallMessage);

        String json = mapper.writeValueAsString(message);
        assertThat(json).isEqualTo("{\n" +
                "  \"DCSAMessage\" : {\n" +
                "    \"MessageDateTime\" : null,\n" +
                "    \"SenderRole\" : null,\n" +
                "    \"ReceiverRole\" : null,\n" +
                "    \"ProcessType\" : \"PortCall\",\n" +
                "    \"ProcessId\" : null,\n" +
                "    \"MessageType\" : \"PortCallMessage\",\n" +
                "    \"VesselIdType\" : \"IMO-VESSEL-NUMBER\",\n" +
                "    \"VesselId\" : null,\n" +
                "    \"PortIdType\" : \"UN/LOCODE\",\n" +
                "    \"PortId\" : null,\n" +
                "    \"TerminalIdType\" : \"UN/LOCODE\",\n" +
                "    \"TerminalId\" : null,\n" +
                "    \"VoyageNumber\" : null,\n" +
                "    \"Event\" : null\n" +
                "  }\n" +
                "}");
    }

    @Test
    public void testReadEmptyHeaderWithEmptyMessage() throws JsonProcessingException {
        DCSAMessage<PortCallMessage> message = mapper.readValue("{\n" +
                "  \"DCSAMessage\" : {\n" +
                "    \"MessageDateTime\" : null,\n" +
                "    \"SenderRole\" : null,\n" +
                "    \"SenderId\" : null,\n" +
                "    \"ReceiverRole\" : null,\n" +
                "    \"ReceiverId\" : null,\n" +
                "    \"ProcessType\" : \"PortCall\",\n" +
                "    \"ProcessId\" : null,\n" +
                "    \"MessageType\" : \"PortCallMessage\",\n" +
                "    \"VesselIdType\" : \"IMO-VESSEL-NUMBER\",\n" +
                "    \"VesselId\" : null,\n" +
                "    \"PortIdType\" : \"UN/LOCODE\",\n" +
                "    \"PortId\" : null,\n" +
                "    \"TerminalIdType\" : \"UN/LOCODE\",\n" +
                "    \"TerminalId\" : null,\n" +
                "    \"VoyageNumber\" : null,\n" +
                "    \"Event\" : null\n" +
                "  }\n" +
                "}", new TypeReference<>() {
        });


        assertThat(message.getMessageDateTime()).isNull();
        assertThat(message.getSenderRole()).isNull();
        assertThat(message.getSenderId()).isNull();
        assertThat(message.getReceiverRole()).isNull();
        assertThat(message.getReceiverId()).isNull();
        assertThat(message.getProcessType()).isEqualTo(ProcessType.PortCall);
        assertThat(message.getProcessId()).isNull();
        assertThat(message.getMessageType()).isEqualTo(MessageType.PortCallMessage);

        assertThat(message.getPayload().getVesselIdType()).isEqualTo(CodeType.IMO_VESSEL_NUMBER);
        assertThat(message.getPayload().getPortIdType()).isEqualTo(CodeType.UN_LOCODE);
        assertThat(message.getPayload().getTerminalIdType()).isEqualTo(CodeType.UN_LOCODE);
    }
}
