package org.dcsa.portcall.service;

import org.dcsa.portcall.PortCallProperties;
import org.dcsa.portcall.db.tables.pojos.PortCallTimestamp;
import org.dcsa.portcall.message.DCSAMessage;
import org.dcsa.portcall.message.RoleType;
import org.dcsa.portcall.service.persistence.PortCallTimestampService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class OutboundPortCallMessageServiceTest extends AbstractDatabaseTest {

    @Autowired
    private PortCallTimestampService timestampService;

    @Autowired
    private OutboundPortCallMessageService outboundService;

    @Autowired
    PortCallProperties config;

    @Test
    void testTimeStampId1() throws Exception {
        this.testExampleMessage(1);
    }




    private void testExampleMessage(int id) throws Exception {
        this.config.setSenderRole(RoleType.CARRIER);
        this.config.setSenderId("TST");
        PortCallTimestamp timestamp = timestampService.getTimeStampById(id).get();
        DCSAMessage message = this.outboundService.process(timestamp).get();
        message.setProcessId("00000000-1111-2222-3333-ABCDEFGHIJKL");
        OffsetDateTime now = OffsetDateTime.of(2020, 11, 25, 18, 48, 0, 0, ZoneOffset.UTC);
        message.setMessageDateTime(now);
        String msgJson =  this.outboundService.getJsonMapper().writeValueAsString(message);
        String targetJson = "{\n" +
                "  \"DCSAMessage\" : {\n" +
                "    \"MessageDateTime\" : \"2020-11-25T18:48Z\",\n" +
                "    \"SenderRole\" : \"CARRIER\",\n" +
                "    \"SenderIdType\" : \"SMDG-LINER-CODE\",\n" +
                "    \"SenderId\" : \"TST\",\n" +
                "    \"ReceiverRole\" : \"TERMINAL\",\n" +
                "    \"ReceiverIdType\" : \"TERMINAL\",\n" +
                "    \"ReceiverId\" : \"ESALG:CTT\",\n" +
                "    \"ProcessType\" : \"PortCall\",\n" +
                "    \"ProcessId\" : \"00000000-1111-2222-3333-ABCDEFGHIJKL\",\n" +
                "    \"MessageType\" : \"PortCallMessage\",\n" +
                "    \"Payload\" : {\n" +
                "      \"VesselIdType\" : \"IMO-VESSEL-NUMBER\",\n" +
                "      \"VesselId\" : \"1234560\",\n" +
                "      \"PortIdType\" : \"UN/LOCODE\",\n" +
                "      \"PortId\" : \"ESALG\",\n" +
                "      \"TerminalIdType\" : \"TERMINAL\",\n" +
                "      \"TerminalId\" : \"CTT\",\n" +
                "      \"NextPortOfCall\" : \"GBFXT\",\n" +
                "      \"VoyageNumber\" : \"Example Loop 1\",\n" +
                "      \"Event\" : {\n" +
                "        \"EventClassifierCode\" : \"EST\",\n" +
                "        \"TransportEventTypeCode\" : \"ARRI\",\n" +
                "        \"LocationId\" : \"urn:mrn:ipcdmc:location:ESALG:berth:CTT:Bollard 55-70\",\n" +
                "        \"EventDateTime\" : \"2020-11-05T14:00Z\",\n" +
                "        \"LocationType\" : \"BERTH\"\n" +
                "      },\n" +
                "      \"PreviousPortOfCall\" : \"DEHAM\"\n" +
                "    }\n" +
                "  }\n" +
                "}";

        assertThat(targetJson).isEqualTo(msgJson);
    }

}