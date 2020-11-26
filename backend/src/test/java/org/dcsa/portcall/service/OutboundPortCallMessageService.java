package org.dcsa.portcall.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.dcsa.portcall.PortCallProperties;
import org.dcsa.portcall.db.enums.PortCallTimestampType;
import org.dcsa.portcall.db.tables.pojos.PortCallTimestamp;
import org.dcsa.portcall.message.*;
import org.dcsa.portcall.service.persistence.PortCallTimestampService;
import org.dcsa.portcall.service.persistence.PortService;
import org.dcsa.portcall.service.persistence.VesselService;
import org.junit.jupiter.api.Test;
import org.postgresql.translation.messages_bg;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.security.Timestamp;
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

    @Test
    void testTimeStampId14() throws Exception {
        this.testExampleMessage(14);
    }

    @Test
    void testTimeStampId9() throws Exception {
        this.testExampleMessage(9);
    }




    private void testExampleMessage(int id) throws Exception {
        this.config.setSenderRole(RoleType.CARRIER);
        this.config.setSenderIdType(CodeType.SMDG_LINER_CODE);
        this.config.setSenderId("TST");
        PortCallTimestamp timestamp = timestampService.getTimeStampById(id).get();
        DCSAMessage<PortCallMessage> message = this.outboundService.process(timestamp).get();


        assertThat(message.getSenderRole()).isEqualTo(RoleType.CARRIER);
        assertThat(message.getSenderId()).isEqualTo("TST");
        assertThat(message.getSenderIdType()).isEqualTo(CodeType.SMDG_LINER_CODE);


        if(timestamp.getTimestampType() == PortCallTimestampType.ETA_Berth) {
            // Test if receiver is Terminal
            assertThat(RoleType.TERMINAL).isEqualTo(message.getReceiverRole());
            assertThat(CodeType.TERMINAL).isEqualTo(message.getReceiverIdType());
            assertThat(EventClassifierCode.EST).isEqualTo(message.getPayload().getEvent().getEventClassifierCode());
            assertThat(TransportEventType.ARRI).isEqualTo(message.getPayload().getEvent().getTransportEventTypeCode());
            assertThat(LocationType.BERTH).isEqualTo(message.getPayload().getEvent().getLocationType());
        } else if(timestamp.getTimestampType() == PortCallTimestampType.PTC_Cargo_Ops){
            // Test if receiver is Carrier
            assertThat(RoleType.CARRIER).isEqualTo(message.getReceiverRole());
            assertThat(CodeType.SMDG_LINER_CODE).isEqualTo(message.getReceiverIdType());
            assertThat(EventClassifierCode.PLA).isEqualTo(message.getPayload().getEvent().getEventClassifierCode());
            assertThat(TransportEventType.COPS).isEqualTo(message.getPayload().getEvent().getTransportEventTypeCode());
            assertThat(LocationType.PORT).isEqualTo(message.getPayload().getEvent().getLocationType());
        } else if(timestamp.getTimestampType() == PortCallTimestampType.ATA_PBP){
           // Test if receiver is Port
            assertThat(RoleType.PORT).isEqualTo(message.getReceiverRole());
            assertThat(CodeType.UN_LOCODE).isEqualTo(message.getReceiverIdType());
            assertThat(EventClassifierCode.ACT).isEqualTo(message.getPayload().getEvent().getEventClassifierCode());
            assertThat(TransportEventType.ARRI).isEqualTo(message.getPayload().getEvent().getTransportEventTypeCode());
            assertThat(LocationType.PILOT_BOARDING_AREA).isEqualTo(message.getPayload().getEvent().getLocationType());

        }

        assertThat(message.getPayload().getVesselIdType()).isEqualTo(CodeType.IMO_VESSEL_NUMBER);


    }

}