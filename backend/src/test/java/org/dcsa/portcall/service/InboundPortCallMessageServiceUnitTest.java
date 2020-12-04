package org.dcsa.portcall.service;

import org.dcsa.portcall.db.tables.pojos.Carrier;
import org.dcsa.portcall.db.tables.pojos.Port;
import org.dcsa.portcall.db.tables.pojos.Terminal;
import org.dcsa.portcall.db.tables.pojos.Vessel;
import org.dcsa.portcall.message.*;
import org.dcsa.portcall.service.persistence.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InboundPortCallMessageServiceUnitTest {

    @Mock
    PortService portService;
    @Mock
    TerminalService terminalService;
    @Mock
    CarrierService carrierService;
    @Mock
    VesselService vesselService;
    @Mock
    PortCallTimestampService timestampService;
    @Mock
    PontonXPCommunicationService communicationService;
    @Mock
    MessageService messageService;

    @Test
    void testEmptyMessage() {
        InboundPortCallMessageService service = new InboundPortCallMessageService(
                portService, terminalService, carrierService, vesselService, timestampService, communicationService, messageService);
        assertThat(service.process(null).isEmpty()).isTrue();
    }

    @Test
    void testUnexpectedVesselIdType() {
        InboundPortCallMessageService service = new InboundPortCallMessageService(
                portService, terminalService, carrierService, vesselService, timestampService, communicationService, messageService);

        DCSAMessage<PortCallMessage> message = new DCSAMessage<PortCallMessage>()
                .setPayload(
                        new PortCallMessage()
                                .setVesselIdType(CodeType.UN_LOCODE)
                                .setVesselId("1234560")
                );

        assertThatThrownBy(() -> service.process(message))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Unexpected vessel id type: %s", CodeType.UN_LOCODE);
    }

    @Test
    void testUnknownVesselWithUnknownCarrier() {
        InboundPortCallMessageService service = new InboundPortCallMessageService(
                portService, terminalService, carrierService, vesselService, timestampService, communicationService, messageService);

        DCSAMessage<PortCallMessage> message = new DCSAMessage<PortCallMessage>()
                .setSenderRole(RoleType.CARRIER)
                .setSenderId("007")
                .setPayload(
                        new PortCallMessage()
                                .setVesselIdType(CodeType.IMO_VESSEL_NUMBER)
                                .setVesselId("1234560")
                );

        assertThatThrownBy(() -> service.process(message))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Could not add vessel with imo '%s' because not carrier with id '007' found", message.getPayload().getVesselId(), message.getSenderId());
    }

    @Test
    void testUnknownVesselWithKnownCarrier() {
        when(carrierService.findBySMDGCode(anyString())).thenReturn(Optional.of(new Carrier(1, "007", "Carrier 007", LocalDate.MIN, "https://carrier")));
        when(portService.findPortByUnLocode(anyString())).thenReturn(Optional.of(new Port(1, "port", "de", "deham", "deham", "UTC")));
        when(terminalService.findTerminalByPortIdAndSMDGCode(anyInt(), anyString())).thenReturn(Optional.of(new Terminal()));
        InboundPortCallMessageService service = new InboundPortCallMessageService(
                portService, terminalService, carrierService, vesselService, timestampService, communicationService, messageService);

        DCSAMessage<PortCallMessage> message = new DCSAMessage<PortCallMessage>()
                .setSenderRole(RoleType.CARRIER)
                .setSenderId("007")
                .setPayload(
                        new PortCallMessage()
                                .setVesselIdType(CodeType.IMO_VESSEL_NUMBER)
                                .setVesselId("1234560")
                                .setPortIdType(CodeType.UN_LOCODE)
                                .setPreviousPortOfCall("nlrtm")
                                .setPortId("deham")
                                .setNextPortOfCall("gbfxt")
                                .setTerminalIdType(CodeType.TERMINAL)
                                .setTerminalId("cta")
                                .setEvent(new PortCallEvent()
                                        .setLocationType(LocationType.BERTH)
                                        .setEventClassifierCode(EventClassifierCode.EST)
                                        .setTransportEventTypeCode(TransportEventType.ARRI)
                                        .setLocationId("Bollard 55-70")
                                )
                );

        assertThat(service.process(message)).isPresent();

        verify(vesselService, times(1)).addVessel(any());
    }

    @Test
    void testUnknownVesselWithMessageNotFromCarrier() {
        InboundPortCallMessageService service = new InboundPortCallMessageService(
                portService, terminalService, carrierService, vesselService, timestampService, communicationService, messageService);

        DCSAMessage<PortCallMessage> message = new DCSAMessage<PortCallMessage>()
                .setSenderRole(RoleType.VESSEL)
                .setSenderId("007")
                .setPayload(
                        new PortCallMessage()
                                .setVesselIdType(CodeType.IMO_VESSEL_NUMBER)
                                .setVesselId("1234560")
                );

        assertThatThrownBy(() -> service.process(message))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Could not add vessel with imo '%s' because sender is not a carrier '%s:%s:%s'",
                        message.getPayload().getVesselId(), message.getSenderRole(), message.getSenderIdType(), message.getSenderId());
    }


    @Test
    void testUnexpectedPortIdType() {
        when(vesselService.findVesselByIMO(anyInt())).thenReturn(Optional.of(new Vessel(1, 1, "Vessel", 1234567, (short) 1000, "SRV")));

        InboundPortCallMessageService service = new InboundPortCallMessageService(
                portService, terminalService, carrierService, vesselService, timestampService, communicationService, messageService);

        DCSAMessage<PortCallMessage> message = new DCSAMessage<PortCallMessage>()
                .setPayload(
                        new PortCallMessage()
                                .setVesselIdType(CodeType.IMO_VESSEL_NUMBER)
                                .setVesselId("1234560")
                                .setPortIdType(CodeType.IMO_VESSEL_NUMBER)
                );

        assertThatThrownBy(() -> service.process(message))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Unexpected port id type: %s", CodeType.IMO_VESSEL_NUMBER);
    }

    @Test
    void testUnknownPortId() {
        when(portService.findPortByUnLocode(anyString())).thenReturn(Optional.empty());
        when(vesselService.findVesselByIMO(anyInt())).thenReturn(Optional.of(new Vessel(1, 1, "Vessel", 1234567, (short) 1000, "SRV")));

        InboundPortCallMessageService service = new InboundPortCallMessageService(
                portService, terminalService, carrierService, vesselService, timestampService, communicationService, messageService);

        DCSAMessage<PortCallMessage> message = new DCSAMessage<PortCallMessage>()
                .setPayload(
                        new PortCallMessage()
                                .setVesselIdType(CodeType.IMO_VESSEL_NUMBER)
                                .setVesselId("1234560")
                                .setPortIdType(CodeType.UN_LOCODE)
                                .setPortId("hier")
                );

        assertThatThrownBy(() -> service.process(message))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Unknown port of call '%s' with id type '%s'", message.getPayload().getPortId(), message.getPayload().getPortIdType());
    }
}