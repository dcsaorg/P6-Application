package org.dcsa.portcall.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.dcsa.portcall.db.enums.MessageDirection;
import org.dcsa.portcall.db.enums.PortCallTimestampType;
import org.dcsa.portcall.db.tables.pojos.PortCallTimestamp;

public class PortCallTimestampExtended extends PortCallTimestamp {

    private static final long serialVersionUID = 3444275199008483270L;

    @JsonProperty
    private PortCallTimestampType response;
    @JsonProperty
    private MessageDirection messageDirection;
    @JsonProperty
    private String messagingStatus;
    @JsonProperty
    private String messagingDetails;
    @JsonProperty
    private boolean outdatedMessage;

    public PortCallTimestampType getResponse() {
        return this.response;
    }
    public void setResponse(PortCallTimestampType response) {
        this.response = response;
    }

    public boolean isOutdatedMessage() {return outdatedMessage;}
    public PortCallTimestampExtended setOutdatedMessage(boolean outdatedMessage) {
        this.outdatedMessage = outdatedMessage;
        return this;
    }

    public MessageDirection getMessageDirection() {
        return messageDirection;
    }
    public PortCallTimestampExtended setMessageDirection(MessageDirection messageDirection) {
        this.messageDirection = messageDirection;
        return this;
    }

    public String getMessagingStatus() {
        return messagingStatus;
    }
    public PortCallTimestampExtended setMessagingStatus(String messagingStatus) {
        this.messagingStatus = messagingStatus;
        return this;
    }

    public String getMessagingDetails() {
        return messagingDetails;
    }
    public PortCallTimestampExtended setMessagingDetails(String messagingDetails) {
        this.messagingDetails = messagingDetails;
        return this;
    }



}
