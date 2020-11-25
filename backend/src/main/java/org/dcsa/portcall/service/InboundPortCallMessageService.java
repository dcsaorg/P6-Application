package org.dcsa.portcall.service;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.dcsa.portcall.db.tables.pojos.Port;
import org.dcsa.portcall.db.tables.pojos.PortCallTimestamp;
import org.dcsa.portcall.db.tables.pojos.Vessel;
import org.dcsa.portcall.message.CodeType;
import org.dcsa.portcall.message.DCSAMessage;
import org.dcsa.portcall.message.PortCallMessage;
import org.dcsa.portcall.service.persistence.MessageService;
import org.dcsa.portcall.service.persistence.PortService;
import org.dcsa.portcall.service.persistence.VesselService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class InboundPortCallMessageService extends AbstractPortCallMessageService<DCSAMessage<PortCallMessage>, PortCallTimestamp> {

    private static final Logger log = LogManager.getLogger(InboundPortCallMessageService.class);

    private PortService portService;
    private VesselService vesselService;
    private MessageService messageService;

    public InboundPortCallMessageService(PortService portService,
                                         VesselService vesselService,
                                         MessageService messageService) {
        this.portService = portService;
        this.vesselService = vesselService;
        this.messageService = messageService;
    }

    @Override
    public Optional<PortCallTimestamp> process(DCSAMessage<PortCallMessage> message) {
        if (message == null) {
            return Optional.empty();
        }

        PortCallTimestamp timestamp = new PortCallTimestamp();

        if (CodeType.IMO_VESSEL_NUMBER.equals(message.getPayload().getVesselIdType())) {
            Optional<Vessel> vessel = vesselService.findVesselByIMO(Integer.parseInt(message.getPayload().getVesselId()));
            if (vessel.isPresent()) {
                timestamp.setVessel(vessel.get().getId());
            } else {
                log.debug("No vessel with imo '{}' found. Storing new vessel for carrier '{}'", message.getPayload().getVesselId(), "?");
                // TODO: Implement adding of unknown vessels
            }
        } else {
            throw new IllegalArgumentException("Unexpected vessel id type: " + message.getPayload().getVesselIdType());
        }

        if (CodeType.UN_LOCODE.equals(message.getPayload().getPortIdType())) {
            Optional<Port> port = portService.findPortByUnLocode(message.getPayload().getPortId());
            if (port.isPresent()) {
                timestamp.setPortOfCall(port.get().getId());
            } else {
                String msg = String.format("Unknown port of call '%s' with id type '%s'", message.getPayload().getPortId(), message.getPayload().getPortIdType());
                log.error(msg);
                throw new IllegalArgumentException(msg);
            }
        } else {
            throw new IllegalArgumentException("Unexpected port of call id type: " + message.getPayload().getPortIdType());
        }


        return Optional.of(timestamp);
    }
}
