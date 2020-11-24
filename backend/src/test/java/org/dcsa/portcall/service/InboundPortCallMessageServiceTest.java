package org.dcsa.portcall.service;

import com.fasterxml.jackson.core.type.TypeReference;
import org.dcsa.portcall.db.tables.pojos.PortCallTimestamp;
import org.dcsa.portcall.message.DCSAMessage;
import org.dcsa.portcall.message.PortCallMessage;
import org.dcsa.portcall.service.persistence.VesselService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class InboundPortCallMessageServiceTest extends AbstractDatabaseTest {

    @Autowired
    private VesselService vesselService;
    @Autowired
    private InboundPortCallMessageService service;

    @Test
    void testExampleMessage() throws Exception {
        DCSAMessage<PortCallMessage> message = service.getJsonMapper().readValue("{\n" +
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
                "    \"Payload\" : {\n" +
                "      \"VesselIdType\" : \"IMO-VESSEL-NUMBER\",\n" +
                "      \"VesselId\" : \"1234560\",\n" +
                "      \"PortIdType\" : \"UN/LOCODE\",\n" +
                "      \"PortId\" : \"deham\",\n" +
                "      \"TerminalIdType\" : \"UN/LOCODE\",\n" +
                "      \"TerminalId\" : \"cta\",\n" +
                "      \"NextPortOfCall\" : \"beanr\",\n" +
                "      \"VoyageNumber\" : \"ABCDEFGH\",\n" +
                "      \"Event\" : {\n" +
                "        \"EventClassifierCode\" : \"EST\",\n" +
                "        \"TransportEventTypeCode\" : \"ARRI\",\n" +
                "        \"LocationId\" : \"rn:mrn:ipcdmc:location:deham:berth:cta:200m\",\n" +
                "        \"EventDateTime\" : \"2020-11-13T17:25Z\",\n" +
                "        \"LocationType\" : \"BERTH\"\n" +
                "      },\n" +
                "      \"PreviousPortOfCall\" : \"nlrtm\",\n" +
                "      \"Remarks\" : \"Hey Joe, here is the missing timestamp that I just  now got from our Agent\"\n" +
                "    }\n" +
                "  }\n" +
                "}", new TypeReference<>() {
        });

        Optional<PortCallTimestamp> timestamp = service.process(message);

        assertThat(timestamp.isPresent()).isTrue();

        assertThat(timestamp.get().getVessel()).isEqualTo(vesselService.findVesselByName("EXAMPLE VESSEL").get().getId());
    }
}