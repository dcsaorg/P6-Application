package org.dcsa.portcall.service;

import de.ponton.xp.adapter.api.AdapterStatusRequestHandler;
import de.ponton.xp.adapter.api.ConnectionException;
import de.ponton.xp.adapter.api.MessageHandler;
import de.ponton.xp.adapter.api.MessengerConnection;
import de.ponton.xp.adapter.api.domainvalues.*;
import de.ponton.xp.adapter.api.messages.InboundMessageStatusUpdate;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.dcsa.portcall.PortCallProperties;
import org.dcsa.portcall.service.persistence.MessageService;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;

@Service
public class PontonXPCommunicationService {

    private static final Logger log = LogManager.getLogger(PontonXPCommunicationService.class);

    private final PortCallProperties.Messenger messengerConfig;
    private final MessageService messageService;

    private MessengerConnection messengerConnection = null;

    public PontonXPCommunicationService(PortCallProperties config, MessageService messageService) {
        this.messengerConfig = config.getMessenger();
        this.messageService = messageService;
    }

    @PostConstruct
    public void initMessengerConnection() {
        final AdapterInfo adapterInfo = AdapterInfo.newBuilder()
                .setAdapterId(messengerConfig.getAdapter().getId())
                .setAdapterVersion(messengerConfig.getAdapter().getVersion())
                .build();

        try {
            messengerConnection = MessengerConnection.newBuilder()
                    .setWorkFolder(Files.createTempDirectory("messenger_work").toFile())
                    .setAdapterInfo(adapterInfo)
                    .addMessengerInstance(MessengerInstance.create(messengerConfig.getHost(), messengerConfig.getPort()))
                    .onMessageReceive(getMessageHandler())
                    .onAdapterStatusRequest(getAdapterStatusRequestHandler())
                    .build();
        } catch (IOException | ConnectionException e) {
            log.warn("Unable to create messenger connection: {}", e.getMessage());
        }
    }


    private MessageHandler getMessageHandler() {
        return inboundMessage -> {
            // handle inbound message
            final InboundMetaData inboundMetaData = inboundMessage.getInboundMetaData();
            final MessageId messageId = inboundMetaData.getMessageId();
            final ConversationId conversationId = inboundMetaData.getConversationId();
            final SenderId senderId = inboundMetaData.getSenderId();
            final ReceiverId receiverId = inboundMetaData.getReceiverId();
            final MessageType messageType = inboundMetaData.getMessageType();

            try (final InputStream in = inboundMessage.createInputStream()) {

            } catch (final IOException ioe) {
                // handle IOException here
            }

            // create result for the inbound message
            return InboundMessageStatusUpdate.newBuilder()
                    .setInboundMessage(inboundMessage)
                    .setStatus(InboundStatusEnum.SUCCESS)
                    .setStatusText("message successfully delivered to backend.")
                    .build();
        };
    }

    private AdapterStatusRequestHandler getAdapterStatusRequestHandler() {
        return () -> String.format("%s adapter is running", messengerConfig.getAdapter().getId());
    }
}
