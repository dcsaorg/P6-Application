package org.dcsa.portcall.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.dcsa.portcall.PortCallProperties;
import org.dcsa.portcall.db.tables.pojos.PortCallTimestamp;
import org.dcsa.portcall.message.*;
import org.dcsa.portcall.service.persistence.PortCallTimestampService;
import org.dcsa.portcall.service.persistence.PortService;
import org.dcsa.portcall.service.persistence.VesselService;
import org.junit.jupiter.api.Test;
import org.postgresql.translation.messages_bg;
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
        this.config.setSenderIdType(CodeType.SMDG_LINER_CODE);
        this.config.setSenderId("TST");
        PortCallTimestamp timestamp = timestampService.getTimeStampById(id).get();
        DCSAMessage<PortCallMessage> message = this.outboundService.process(timestamp).get();
        message.setProcessId("00000000-1111-2222-3333-ABCDEFGHIJKL");
        OffsetDateTime now = OffsetDateTime.of(2020, 11, 25, 18, 48, 0, 0, ZoneOffset.UTC);
        message.setMessageDateTime(now);


        assertThat(message.getSenderRole()).isEqualTo(RoleType.CARRIER);
        assertThat(message.getSenderId()).isEqualTo("TST");
        assertThat(message.getSenderIdType()).isEqualTo(CodeType.SMDG_LINER_CODE);
        assertThat(message.getMessageDateTime()).isEqualTo( OffsetDateTime.of(2020, 11, 25, 18, 48, 0, 0, ZoneOffset.UTC));
        assertThat(message.getReceiverRole()).isEqualTo(RoleType.TERMINAL);
        assertThat(message.getReceiverIdType()).isEqualTo(CodeType.TERMINAL);
        assertThat(message.getPayload().getVesselIdType()).isEqualTo(CodeType.IMO_VESSEL_NUMBER);
        assertThat(message.getPayload().getEvent().getEventClassifierCode()).isEqualTo(EventClassifierCode.EST);
        assertThat(message.getPayload().getEvent().getTransportEventTypeCode()).isEqualTo(TransportEventType.ARRI);
        assertThat(message.getPayload().getEvent().getLocationType()).isEqualTo(LocationType.BERTH);

    }

}