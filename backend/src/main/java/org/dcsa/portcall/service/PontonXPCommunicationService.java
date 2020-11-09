package org.dcsa.portcall.service;

import de.ponton.xp.adapter.api.AdapterStatusRequestHandler;
import de.ponton.xp.adapter.api.ConnectionException;
import de.ponton.xp.adapter.api.MessageHandler;
import de.ponton.xp.adapter.api.MessengerConnection;
import de.ponton.xp.adapter.api.domainvalues.AdapterInfo;
import de.ponton.xp.adapter.api.domainvalues.MessengerInstance;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.dcsa.portcall.PortCallProperties;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;

@Service
public class PontonXPCommunicationService {

    private static final Logger log = LogManager.getLogger(PontonXPCommunicationService.class);

    private PortCallProperties.Messenger messengerConfig;

    private MessengerConnection messengerConnection = null;

    public PontonXPCommunicationService(PortCallProperties config) {
        this.messengerConfig = config.getMessenger();
    }

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
            log.fatal("Unable to create messenger connection", e);
        }
    }


    private MessageHandler getMessageHandler() {
        return null;
    }

    private AdapterStatusRequestHandler getAdapterStatusRequestHandler() {
        return () -> String.format("%s adapter is running", messengerConfig.getAdapter().getId());
    }
}
