package org.dcsa.portcall.service;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.dcsa.portcall.db.tables.pojos.PortCallTimestamp;
import org.dcsa.portcall.message.DCSAMessage;
import org.dcsa.portcall.message.PortCallMessage;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class InboundPortCallMessageService extends AbstractPortCallMessageService<DCSAMessage<PortCallMessage>, PortCallTimestamp> {

    private static final Logger log = LogManager.getLogger(InboundPortCallMessageService.class);

    @Override
    public Optional<PortCallTimestamp> process(DCSAMessage<PortCallMessage> message) {
        if (message == null) {
            return Optional.empty();
        }

        PortCallTimestamp timestamp = new PortCallTimestamp();
        return Optional.of(timestamp);
    }
}
