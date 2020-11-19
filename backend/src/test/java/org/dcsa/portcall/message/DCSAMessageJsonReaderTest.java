package org.dcsa.portcall.message;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.dcsa.portcall.service.PortCallMessageService;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import static org.assertj.core.api.Assertions.assertThat;

public class DCSAMessageJsonReaderTest {

    private static ObjectMapper mapper;

    @BeforeAll
    static void before() {
        PortCallMessageService portCallMessageService = new PortCallMessageService();
        mapper = portCallMessageService.getJsonMapper();
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
    @Disabled
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
                "}", mapper.getTypeFactory().constructParametricType(DCSAMessage.class, PortCallMessage.class));

        assertThat(message.getMessageDateTime()).isEqualTo(OffsetDateTime.of(2020, 11, 13, 17, 25, 0, 0, ZoneOffset.UTC));
        assertThat(message.getSenderRole()).isEqualTo(RoleType.VESSEL);
        assertThat(message.getSenderIdType()).isEqualTo(CodeType.IMO_VESSEL_NUMBER);
        assertThat(message.getSenderId()).isEqualTo("9074729");
        assertThat(message.getReceiverRole()).isEqualTo(RoleType.TERMINAL);
        assertThat(message.getReceiverIdType()).isEqualTo(CodeType.UN_LOCODE);
        assertThat(message.getReceiverId()).isEqualTo("9074729");
        assertThat(message.getGatewayId()).isEqualTo("PC-SERVICE");
        assertThat(message.getOtherReceiver()).isNotNull();
        assertThat(message.getOtherReceiver().size()).isEqualTo(1);
        assertThat(message.getOtherReceiver().get(0).getOtherReceiverRole()).isEqualTo(RoleType.PILOT);
        assertThat(message.getOtherReceiver().get(0).getOtherReceiverIdType()).isEqualTo(CodeType.PILOT);
        assertThat(message.getOtherReceiver().get(0).getOtherReceiverId()).isEqualTo("NLRTM:PILOTSERVICE");
        assertThat(message.getProcessType()).isEqualTo(ProcessType.PortCall);
        assertThat(message.getProcessId()).isEqualTo("MSC-ABCDEFGH");
        assertThat(message.getMessageType()).isEqualTo(MessageType.PortCallMessage);
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

    @Test
    @Disabled
    public void testReaderFullHeaderWithFullMessage() throws JsonProcessingException {
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
                "    \"MessageType\" : \"PortCallMessage\",\n" +
                "    \"VesselIdType\" : \"IMO-VESSEL-NUMBER\",\n" +
                "    \"VesselId\" : \"9074729\",\n" +
                "    \"PortIdType\" : \"UN/LOCODE\",\n" +
                "    \"PortId\" : \"deham\",\n" +
                "    \"TerminalIdType\" : \"UN/LOCODE\",\n" +
                "    \"TerminalId\" : \"cta\",\n" +
                "    \"NextPortOfCall\" : \"beanr\",\n" +
                "    \"VoyageNumber\" : \"ABCDEFGH\",\n" +
                "    \"Event\" : {\n" +
                "      \"EventClassifierCode\" : \"EST\",\n" +
                "      \"TransportEventTypeCode\" : \"ARRI\",\n" +
                "      \"LocationId\" : \"rn:mrn:ipcdmc:location:deham:berth:cta:200m\",\n" +
                "      \"EventDateTime\" : \"2020-11-13T17:25Z\",\n" +
                "      \"LocationType\" : \"BERTH\"\n" +
                "    },\n" +
                "    \"PreviousPortOfCall\" : \"nlrtm\",\n" +
                "    \"Remarks\" : \"Hey Joe, here is the missing timestamp that I just  now got from our Agent\"\n" +
                "  }\n" +
                "}", new TypeReference<>() {
        });

        assertThat(message.getMessageDateTime()).isEqualTo(OffsetDateTime.of(2020, 11, 13, 17, 25, 0, 0, ZoneOffset.UTC));
        assertThat(message.getSenderRole()).isEqualTo(RoleType.VESSEL);
        assertThat(message.getSenderIdType()).isEqualTo(CodeType.IMO_VESSEL_NUMBER);
        assertThat(message.getSenderId()).isEqualTo("9074729");
        assertThat(message.getReceiverRole()).isEqualTo(RoleType.TERMINAL);
        assertThat(message.getReceiverIdType()).isEqualTo(CodeType.UN_LOCODE);
        assertThat(message.getReceiverId()).isEqualTo("9074729");
        assertThat(message.getGatewayId()).isEqualTo("PC-SERVICE");
        assertThat(message.getOtherReceiver()).isNotNull();
        assertThat(message.getOtherReceiver().size()).isEqualTo(1);
        assertThat(message.getOtherReceiver().get(0).getOtherReceiverRole()).isEqualTo(RoleType.PILOT);
        assertThat(message.getOtherReceiver().get(0).getOtherReceiverIdType()).isEqualTo(CodeType.PILOT);
        assertThat(message.getOtherReceiver().get(0).getOtherReceiverId()).isEqualTo("NLRTM:PILOTSERVICE");
        assertThat(message.getProcessType()).isEqualTo(ProcessType.PortCall);
        assertThat(message.getProcessId()).isEqualTo("MSC-ABCDEFGH");
        assertThat(message.getMessageType()).isEqualTo(MessageType.PortCallMessage);
    }
}
