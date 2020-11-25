package org.dcsa.portcall.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.dcsa.portcall.PortCallProperties;
import org.dcsa.portcall.db.tables.pojos.PortCallTimestamp;
import org.dcsa.portcall.message.DCSAMessage;
import org.dcsa.portcall.message.PortCallMessage;
import org.dcsa.portcall.message.RoleType;
import org.dcsa.portcall.service.persistence.PortCallTimestampService;
import org.dcsa.portcall.service.persistence.PortService;
import org.dcsa.portcall.service.persistence.VesselService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Optional;

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
        String targetJson = "{\r\n" +
                "  \"DCSAMessage\" : {\r\n" +
                "    \"MessageDateTime\" : \"2020-11-25T18:48Z\",\r\n" +
                "    \"SenderRole\" : \"CARRIER\",\r\n" +
                "    \"SenderIdType\" : \"SMDG-LINER-CODE\",\r\n" +
                "    \"SenderId\" : \"TST\",\r\n" +
                "    \"ReceiverRole\" : \"TERMINAL\",\r\n" +
                "    \"ReceiverIdType\" : \"TERMINAL\",\r\n" +
                "    \"ReceiverId\" : \"ESALG:CTT\",\r\n" +
                "    \"ProcessType\" : \"PortCall\",\r\n" +
                "    \"ProcessId\" : \"00000000-1111-2222-3333-ABCDEFGHIJKL\",\r\n" +
                "    \"MessageType\" : \"PortCallMessage\",\r\n" +
                "    \"Payload\" : {\r\n" +
                "      \"VesselIdType\" : \"IMO-VESSEL-NUMBER\",\r\n" +
                "      \"VesselId\" : \"1234560\",\r\n" +
                "      \"PortIdType\" : \"UN/LOCODE\",\r\n" +
                "      \"PortId\" : \"ESALG\",\r\n" +
                "      \"TerminalIdType\" : \"TERMINAL\",\r\n" +
                "      \"TerminalId\" : \"CTT\",\r\n" +
                "      \"NextPortOfCall\" : \"GBFXT\",\r\n" +
                "      \"VoyageNumber\" : \"Example Loop 1\",\r\n" +
                "      \"Event\" : {\r\n" +
                "        \"EventClassifierCode\" : \"EST\",\r\n" +
                "        \"TransportEventTypeCode\" : \"ARRI\",\r\n" +
                "        \"LocationId\" : \"urn:mrn:ipcdmc:location:ESALG:berth:CTT:Bollard 55-70\",\r\n" +
                "        \"EventDateTime\" : \"2020-11-05T14:00Z\",\r\n" +
                "        \"LocationType\" : \"BERTH\"\r\n" +
                "      },\r\n" +
                "      \"PreviousPortOfCall\" : \"DEHAM\"\r\n" +
                "    }\r\n" +
                "  }\r\n" +
                "}";

        assertThat(targetJson).isEqualTo(msgJson);
    }

}