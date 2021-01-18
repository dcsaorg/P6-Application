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
import java.nio.file.Path;
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
                        Path workFolder = Path.of("../messenger_work");
                        if (!Files.isDirectory(workFolder)) {
                            Files.createDirectory(workFolder);
                        }
                        messengerConnection = MessengerConnection.newBuilder()
                                .setWorkFolder(workFolder.toFile())
                                .setAdapterInfo(adapterInfo)
                                .addMessengerInstance(MessengerInstance.create(messengerConfig.getHost(), messengerConfig.getPort()))
                                .onMessageReceive(getMessageHandler())
                                .onMessageStatusUpdate(getOutboundMessageStatusUpdateHandler())
                                .onAdapterStatusRequest(getAdapterStatusRequestHandler())
                                .build();
                        log.info("Successfully connected to messenger");
                    } catch (ConnectionException e) {
                        log.warn("Could not connect to messenger: {}", e.getMessage());
                        throw e;
                    } catch (Exception e) {
                        log.error("Unexpected error while connecting to messenger", e);
                        throw  e;
                    }
                    return messengerConnection;
                });
                messengerConnection.start();
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
    {}
    private AdapterStatusRequestHandler getAdapterStatusRequestHandler() {
        return () -> String.format("%s adapter is running", messengerConfig.getAdapter().getId());
    }

    public void sendMessage(final String senderId, final String receiverId, Message message) throws TransmissionException {
        if (messengerConnection != null) {
            final OutboundMetaData outboundMetaData = OutboundMetaData.newBuilder()
                    .setSenderId(new SenderId(senderId.toLowerCase()))
                    .setReceiverId(new ReceiverId(receiverId.toLowerCase()))
                    .build();
            final OutboundMessage outboundMessage = OutboundMessage.newBuilder()
                    .setInputStream(new ByteArrayInputStream(message.getPayload()))
                    .setOutboundMetaData(outboundMetaData)
                    .build();
            final TransferId transferId = messengerConnection.sendMessage(outboundMessage);

            // Storing the transfer id in database to handle status updates later
            messageService.updateTransferId(message.getId(), transferId.getValue());
            log.info("Sent message '{}' from '{}' to '{}' with transfer id '{}'", message.getId(), senderId, receiverId, transferId.getValue());
        } else {
            log.fatal("Could not send message '{}' from '{}' to '{}' because messenger connection is not available", message.getId(), senderId, receiverId);
        }
    }

    private OutboundMessageStatusUpdateHandler getOutboundMessageStatusUpdateHandler() {
        return outboundMessageStatusUpdate -> {
            // the send process is finished.
            if (outboundMessageStatusUpdate.isFinal()) {
                // get transferId to reference the sent outbound message (see sendMessage())
                final TransferId transferId = outboundMessageStatusUpdate.getTransferId();

                // We can send the result of the sent message to backend.
                final OutboundStatusEnum status = outboundMessageStatusUpdate.getResult();
                StringBuilder detail = new StringBuilder();
                if (status == OutboundStatusEnum.SUCCESS) {
                    detail.append("Message successfully sent at ")
                            .append(outboundMessageStatusUpdate.getStatusMetaData().getReceptionTime())
                            .append(" to ")
                            .append(outboundMessageStatusUpdate.getStatusMetaData().getReceiverId())
                            .append(": ");
                } else {
                    detail.append("Message sent at ")
                            .append(outboundMessageStatusUpdate.getStatusMetaData().getReceptionTime())
                            .append(" to ")
                            .append(outboundMessageStatusUpdate.getStatusMetaData().getReceiverId())
                            .append(": ");
                }
                detail.append(outboundMessageStatusUpdate.getDetailText());

                log.info("Received status update for message {}: {}:{}", transferId.getValue(), status, outboundMessageStatusUpdate.getDetailText());
                messageService.updateStatus(transferId.getValue(), status.name(), detail.toString());
            }
        };
    }
}
