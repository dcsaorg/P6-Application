package org.dcsa.portcall.service;

import com.fasterxml.jackson.core.type.TypeReference;
import org.dcsa.portcall.db.enums.PortCallTimestampType;
import org.dcsa.portcall.db.tables.pojos.PortCallTimestamp;
import org.dcsa.portcall.message.DCSAMessage;
import org.dcsa.portcall.message.PortCallMessage;
import org.dcsa.portcall.service.persistence.PortService;
import org.dcsa.portcall.service.persistence.TerminalService;
import org.dcsa.portcall.service.persistence.VesselService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class InboundPortCallMessageServiceTest extends AbstractDatabaseTest {

    @Autowired
    private PortService portService;
    @Autowired
    private TerminalService terminalService;
    @Autowired
    private VesselService vesselService;
    @Autowired
    private InboundPortCallMessageService service;

    @Test
    void testExampleMessage() throws Exception {
        DCSAMessage<PortCallMessage> message = service.getJsonMapper().readValue("{\n" +
                "  \"DCSAMessage\" : {\n" +
                "    \"MessageDateTime\" : \"2020-11-13T17:25:31Z\",\n" +
                "    \"SenderRole\" : \"CARRIER\",\n" +
                "    \"SenderIdType\" : \"SMDG-LINER-CODE\",\n" +
                "    \"SenderId\" : \"EXP\",\n" +
                "    \"ReceiverRole\" : \"TERMINAL\",\n" +
                "    \"ReceiverIdType\" : \"UNLOCODE\",\n" +
                "    \"ReceiverId\" : \"DEHAM:CTT\"," +
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
                "      \"PortIdType\" : \"UNLOCODE\",\n" +
                "      \"PortId\" : \"deham\",\n" +
                "      \"TerminalIdType\" : \"UNLOCODE\",\n" +
                "      \"TerminalId\" : \"cta\",\n" +
                "      \"NextPortOfCall\" : \"beanr\",\n" +
                "      \"VoyageNumber\" : \"ABCDEFGH\",\n" +
                "      \"Event\" : {\n" +
                "        \"EventClassifierCode\" : \"EST\",\n" +
                "        \"TransportEventTypeCode\" : \"ARRI\",\n" +
                "        \"LocationId\" : \"urn:mrn:ipcdmc:location:deham:berth:cta:200m\",\n" +
                "        \"EventDateTime\" : \"2020-11-13T17:25:31Z\",\n" +
                "        \"LocationType\" : \"BERTH\"\n" +
                "      },\n" +
                "      \"PreviousPortOfCall\" : \"nlrtm\",\n" +
                "      \"Remarks\" : \"Hey Joe, here is the missing timestamp that I just now got from our Agent\"\n" +
                "    }\n" +
                "  }\n" +
                "}", new TypeReference<>() {
        });

        Optional<PortCallTimestamp> timestamp = service.process(message);

        assertThat(timestamp.isPresent()).isTrue();

        assertThat(timestamp.get().getId()).isNull();
        assertThat(timestamp.get().getVessel()).isEqualTo(vesselService.findVesselByName("EXAMPLE VESSEL").get().getId());
        assertThat(timestamp.get().getVesselServiceName()).isEqualTo("ABCDEFGH");
        assertThat(timestamp.get().getPortOfCall()).isEqualTo(portService.findPortByUnLocode("DEHAM").get().getId());
        assertThat(timestamp.get().getPortPrevious()).isEqualTo(portService.findPortByUnLocode("nlrtm").get().getId());
        assertThat(timestamp.get().getPortNext()).isEqualTo(portService.findPortByUnLocode("beanr").get().getId());
        assertThat(timestamp.get().getTimestampType()).isEqualTo(PortCallTimestampType.ETA_Berth);
        assertThat(timestamp.get().getCallSequence()).isNull();
        assertThat(timestamp.get().getEventTimestamp()).isEqualTo(OffsetDateTime.of(2020, 11, 13, 17, 25, 31, 0 , ZoneOffset.UTC));
        assertThat(timestamp.get().getLogOfTimestamp()).isEqualTo(OffsetDateTime.of(2020, 11, 13, 17, 25, 31, 0 , ZoneOffset.UTC));
        assertThat(timestamp.get().getDirection()).isNull();
        assertThat(timestamp.get().getTerminal()).isEqualTo(terminalService.findTerminalByPortIdAndSMDGCode(timestamp.get().getPortOfCall(), "cta").get().getId());
        assertThat(timestamp.get().getLocationId()).isEqualTo("200m");
        assertThat(timestamp.get().getChangeComment()).isEqualTo("Hey Joe, here is the missing timestamp that I just now got from our Agent");
        assertThat(timestamp.get().getDelayCode()).isNull();
        assertThat(timestamp.get().getDeleted()).isNull();
    }
}