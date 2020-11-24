package org.dcsa.portcall.service;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.dcsa.portcall.db.tables.pojos.PortCallTimestamp;
import org.dcsa.portcall.db.tables.pojos.Vessel;
import org.dcsa.portcall.message.DCSAMessage;
import org.dcsa.portcall.message.PortCallMessage;
import org.dcsa.portcall.service.persistence.MessageService;
import org.dcsa.portcall.service.persistence.VesselService;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class InboundPortCallMessageService extends AbstractPortCallMessageService<DCSAMessage<PortCallMessage>, PortCallTimestamp> {

    private static final Logger log = LogManager.getLogger(InboundPortCallMessageService.class);

    private VesselService vesselService;
    private MessageService messageService;

    public InboundPortCallMessageService(VesselService vesselService, MessageService messageService) {
        this.vesselService = vesselService;
        this.messageService = messageService;
    }

    @Override
    public Optional<PortCallTimestamp> process(DCSAMessage<PortCallMessage> message) {
        if (message == null) {
            return Optional.empty();
        }

        PortCallTimestamp timestamp = new PortCallTimestamp();

        switch (message.getPayload().getVesselIdType()) {
            case IMO_VESSEL_NUMBER:
                Optional<Vessel> vessel = vesselService.findVesselByIMO(Integer.parseInt(message.getPayload().getVesselId()));
                if (vessel.isPresent()) {
                    timestamp.setVessel(vessel.get().getId());
                } else {
                    log.debug("No vessel with imo '{}' found. Storing new vessel for carrier '{}'", message.getPayload().getVesselId(), "?");
                }
                break;
            default:
                throw new IllegalArgumentException("Unexpected vessel id type: " + message.getPayload().getVesselIdType());
        }

        return Optional.of(timestamp);
    }
}
