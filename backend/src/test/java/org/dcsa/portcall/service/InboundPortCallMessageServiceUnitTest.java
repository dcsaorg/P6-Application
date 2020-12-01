package org.dcsa.portcall.service;

import org.dcsa.portcall.message.CodeType;
import org.dcsa.portcall.message.DCSAMessage;
import org.dcsa.portcall.message.PortCallMessage;
import org.dcsa.portcall.service.persistence.*;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class InboundPortCallMessageServiceUnitTest {

    @Test
    void testEmptyMessage() {
        InboundPortCallMessageService service = new InboundPortCallMessageService(
                mock(PortService.class), mock(TerminalService.class),
                mock(VesselService.class), mock(MessageService.class),
                mock(PortCallTimestampService.class), mock(PontonXPCommunicationService.class));
        assertThat(service.process(null).isEmpty()).isTrue();
    }

    @Test
    void testUnexpectedVesselIdType() {
        InboundPortCallMessageService service = new InboundPortCallMessageService(
                mock(PortService.class), mock(TerminalService.class),
                mock(VesselService.class), mock(MessageService.class),
                mock(PortCallTimestampService.class), mock(PontonXPCommunicationService.class));

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
    void testUnexpectedPortIdType() {
        InboundPortCallMessageService service = new InboundPortCallMessageService(
                mock(PortService.class), mock(TerminalService.class),
                mock(VesselService.class), mock(MessageService.class),
                mock(PortCallTimestampService.class), mock(PontonXPCommunicationService.class));

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
        PortService portService = mock(PortService.class);
        when(portService.findPortByUnLocode(anyString())).thenReturn(Optional.empty());

        InboundPortCallMessageService service = new InboundPortCallMessageService(
                portService, mock(TerminalService.class),
                mock(VesselService.class), mock(MessageService.class),
                mock(PortCallTimestampService.class), mock(PontonXPCommunicationService.class));

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