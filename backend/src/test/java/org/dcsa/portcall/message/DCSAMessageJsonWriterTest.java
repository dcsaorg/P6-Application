package org.dcsa.portcall.message;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.dcsa.portcall.service.PortCallMessageService;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Collections;

import static org.assertj.core.api.Assertions.assertThat;

public class DCSAMessageJsonWriterTest {

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
    public void testWriterFullHeaderWithFullMessage() throws JsonProcessingException {
        OffsetDateTime timestamp = OffsetDateTime.of(2020, 11, 13, 17, 25, 31, 43, ZoneOffset.UTC);
        PortCallEvent event = new PortCallEvent()
                .setEventClassifierCode(EventClassifierCode.EST)
                .setTransportEventTypeCode(TransportEventType.ARRI)
                .setLocationType(LocationType.BERTH).setLocationId("rn:mrn:ipcdmc:location:deham:berth:cta:200m")
                .setEventDateTime(timestamp);
        PortCallMessage portCallMessage = new PortCallMessage()
                .setVesselIdType(CodeType.IMO_VESSEL_NUMBER).setVesselId("9074729")
                .setPortIdType(CodeType.UN_LOCODE).setPortId("deham")
                .setTerminalIdType(CodeType.UN_LOCODE).setTerminalId("cta")
                .setPreviousPortOfCall("nlrtm")
                .setNextPortOfCall("beanr")
                .setVoyageNumber("ABCDEFGH")
                .setEvent(event)
                .setRemarks("Hey Joe, here is the missing timestamp that I just  now got from our Agent");
        DCSAMessage<PortCallMessage> message = new DCSAMessage<>();
        message.setMessageDateTime(timestamp)
                .setSenderRole(RoleType.VESSEL).setSenderId("9074729")
                .setReceiverRole(RoleType.TERMINAL).setReceiverId("deham:cta")
                .setGatewayId("PC-SERVICE")
                .setOtherReceiver(Collections.singletonList(new OtherParty().setOtherReceiverRole(RoleType.PILOT).setOtherReceiverId("NLRTM:PILOTSERVICE")))
                .setProcessId("MSC-ABCDEFGH")
                .setPayload(portCallMessage);

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
                "}");
    }
}
