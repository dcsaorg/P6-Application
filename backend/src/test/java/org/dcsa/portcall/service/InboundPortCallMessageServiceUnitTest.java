package org.dcsa.portcall.service;

import org.dcsa.portcall.message.CodeType;
import org.dcsa.portcall.message.DCSAMessage;
import org.dcsa.portcall.message.PortCallMessage;
import org.dcsa.portcall.service.persistence.MessageService;
import org.dcsa.portcall.service.persistence.PortService;
import org.dcsa.portcall.service.persistence.VesselService;
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
                mock(PortService.class), mock(VesselService.class), mock(MessageService.class));
        assertThat(service.process(null).isEmpty()).isTrue();
    }

    @Test
    void testUnexpectedVesselIdType() {
        InboundPortCallMessageService service = new InboundPortCallMessageService(
                mock(PortService.class), mock(VesselService.class), mock(MessageService.class));

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
                mock(PortService.class), mock(VesselService.class), mock(MessageService.class));

        DCSAMessage<PortCallMessage> message = new DCSAMessage<PortCallMessage>()
                .setPayload(
                        new PortCallMessage()
                                .setVesselIdType(CodeType.IMO_VESSEL_NUMBER)
                                .setVesselId("1234560")
                                .setPortIdType(CodeType.IMO_VESSEL_NUMBER)
                );

        assertThatThrownBy(() -> service.process(message))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Unexpected port of call id type: %s", CodeType.IMO_VESSEL_NUMBER);
    }

    @Test
    void testUnknownPortId() {
        PortService portService = mock(PortService.class);
        when(portService.findPortByUnLocode(anyString())).thenReturn(Optional.empty());

        InboundPortCallMessageService service = new InboundPortCallMessageService(
                portService, mock(VesselService.class), mock(MessageService.class));

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