package org.dcsa.portcall.service;

import de.ponton.xp.adapter.api.*;
import de.ponton.xp.adapter.api.domainvalues.*;
import de.ponton.xp.adapter.api.messages.InboundMessage;
import de.ponton.xp.adapter.api.messages.InboundMessageStatusUpdate;
import de.ponton.xp.adapter.api.messages.OutboundMessage;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.dcsa.portcall.PortCallProperties;
import org.dcsa.portcall.db.enums.MessageDirection;
import org.dcsa.portcall.db.tables.pojos.Message;
import org.dcsa.portcall.service.persistence.MessageService;
import org.springframework.retry.support.RetryTemplate;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.util.Optional;
import java.util.function.BiFunction;

@Service
public class PontonXPCommunicationService {

    private static final Logger log = LogManager.getLogger(PontonXPCommunicationService.class);

    private final PortCallProperties.Messenger messengerConfig;
    private final MessageService messageService;

    private MessengerConnection messengerConnection = null;
    private BiFunction<InboundMessage, Message, InboundMessageStatusUpdate> inboundMessageProcessor;

    public PontonXPCommunicationService(PortCallProperties config, MessageService messageService) {
        this.messengerConfig = config.getMessenger();
        this.messageService = messageService;
    }

    @PostConstruct
    public void initMessengerConnection() throws Exception {
        final AdapterInfo adapterInfo = AdapterInfo.newBuilder()
                .setAdapterId(messengerConfig.getAdapter().getId())
                .setAdapterVersion(messengerConfig.getAdapter().getVersion())
                .build();

        Thread messengerConnectionThread = new Thread(() -> {
            try {
                RetryTemplate retry = RetryTemplate.builder()
                        .infiniteRetry()
                        .uniformRandomBackoff(5 * 1000L, 5 * 60 * 1000L)
                        .retryOn(IOException.class)
                        .retryOn(ConnectionException.class)
                        .build();
                messengerConnection = retry.execute(context -> {
                    log.info("Try {}: Connection to messenger at '{}:{}'", context.getRetryCount(), messengerConfig.getHost(), messengerConfig.getPort());
                    MessengerConnection messengerConnection;
                    try {
                        messengerConnection = MessengerConnection.newBuilder()
                                .setWorkFolder(Files.createTempDirectory("messenger_work").toFile())
                                .setAdapterInfo(adapterInfo)
                                .addMessengerInstance(MessengerInstance.create(messengerConfig.getHost(), messengerConfig.getPort()))
                                .onMessageReceive(getMessageHandler())
                                .onAdapterStatusRequest(getAdapterStatusRequestHandler())
                                .build();
                        log.info("Successfully connected to messenger");
                    } catch (ConnectionException e) {
                        log.warn("Could not connect to messenger: {}", e.getMessage());
                        throw e;
                    }
                    return messengerConnection;
                });
            } catch (Exception e) {
                log.fatal("Unable to create connection to messenger", e);
            }
        }, "MessengerConnectionThread");
        messengerConnectionThread.start();
    }

    public void registerInboundMessageProcessor(BiFunction<InboundMessage, Message, InboundMessageStatusUpdate> inboundMessageProcessor) {
        this.inboundMessageProcessor = inboundMessageProcessor;
    }

    private MessageHandler getMessageHandler() {
        return inboundMessage -> {
            if (inboundMessageProcessor != null) {
                // handle inbound message
                final InboundMetaData inboundMetaData = inboundMessage.getInboundMetaData();
                final MessageId messageId = inboundMetaData.getMessageId();
                final ConversationId conversationId = inboundMetaData.getConversationId();
                final SenderId senderId = inboundMetaData.getSenderId();
                final ReceiverId receiverId = inboundMetaData.getReceiverId();
                final MessageType messageType = inboundMetaData.getMessageType();

                try (final InputStream in = inboundMessage.createInputStream()) {
                    Optional<Message> message = messageService.saveMessage(MessageDirection.inbound,
                            String.format("%s_%s@%s.json", conversationId.getValue(), messageId.getValue(), senderId.getValue()),
                            in);
                    if (message.isPresent()) {
                        return inboundMessageProcessor.apply(inboundMessage, message.get());
                    } else {
                        return InboundMessageStatusUpdate.newBuilder()
                                .setInboundMessage(inboundMessage)
                                .setStatus(InboundStatusEnum.TEMPORARY_ERROR)
                                .setStatusText("Inbound message could not be stored.")
                                .build();
                    }
                } catch (final IOException ioe) {
                    log.fatal("Unable to store incoming message", ioe);
                }
            }

            return InboundMessageStatusUpdate.newBuilder()
                    .setInboundMessage(inboundMessage)
                    .setStatus(InboundStatusEnum.TEMPORARY_ERROR)
                    .setStatusText("No inbound message processor registered.")
                    .build();
        };
    }

    private AdapterStatusRequestHandler getAdapterStatusRequestHandler() {
        return () -> String.format("%s adapter is running", messengerConfig.getAdapter().getId());
    }

    public void sendMessage(final String senderId, final String receiverId, Message message) throws TransmissionException {
        if (messengerConnection != null) {
            final OutboundMetaData outboundMetaData = OutboundMetaData.newBuilder()
                    .setSenderId(new SenderId(senderId))
                    .setReceiverId(new ReceiverId(receiverId))
                    .build();
            final OutboundMessage outboundMessage = OutboundMessage.newBuilder()
                    .setInputStream(new ByteArrayInputStream(message.getPayload()))
                    .setOutboundMetaData(outboundMetaData)
                    .build();
            final TransferId transferId = messengerConnection.sendMessage(outboundMessage);
            log.info("Sent message '{}' from '{}' to '{}' with transfer id '{}'", message.getId(), senderId, receiverId, transferId.getValue());
        } else {
            log.fatal("Could not send message '{}' from '{}' to '{}' because messenger connection is not available", message.getId(), senderId, receiverId);
        }
    }
}
