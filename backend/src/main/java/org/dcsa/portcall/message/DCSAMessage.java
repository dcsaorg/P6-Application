package org.dcsa.portcall.message;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.annotation.JsonUnwrapped;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.dcsa.portcall.message.converter.*;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_EMPTY;
import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;

/**
 * {
 *     "DCSAMessage":{
 *        "MessageDateTime" : 	"2020-07-16T15:12Z",
 *        "SenderRole" : 		"VESSEL",
 *        "SenderIDType" :		"IMO-VESSEL-NUMBER",
 *        "SenderID" :		"9074729",
 *        "ReceiverRole" :		"TERMINAL",
 *        "ReceiverIDType" :	"UN/LOCODE",
 *        "ReceiverID" :		"deham:cta",
 *        "GatewayID" :		"PC-SERVICE", // optional
 *        “OtherParty” : {
 *            “OtherReceiverRole” :	“PILOT”,
 *            “OtherReceiverIDType” :	“PILOTCODE”,
 *            “OtherReceiverID” :	“NLRTM:PILOTSERVICE”
 *        },
 *        “ProcessType” : 		“PortCall”,
 *        “ProcessID” :		“MSC-ABCDEFGH”,
 *        “MessageType” : 		“PortCallMessage”,
 * // PAYLOAD DATA EMBEDDED HERE, STRUCTURED ACCORDING TO MESSAGE TYPE
 * }
 */
@JsonPropertyOrder({
        "messageDateTime",
        "senderRole", "senderIdType", "senderId",
        "receiverRole", "receiverIdType", "receiverId",
        "gatewayId", "otherReceiver", "processType", "processId", "messageType"
})
public class DCSAMessage<T> {

    @JsonInclude(NON_NULL)
    @JsonSerialize(using = OffsetDateTimeSerializer.class)
    @JsonDeserialize(using = OffsetDateTimeDeserializer.class)
    private OffsetDateTime messageDateTime;

    @JsonInclude(NON_NULL)
    private RoleType senderRole;

    @JsonInclude(NON_NULL)
    @JsonSerialize(converter = CodeTypeToStringConverter.class)
    @JsonDeserialize(converter = StringToCodeTypeConverter.class)
    private CodeType senderIdType;
    @JsonInclude(NON_NULL)
    private String senderId;

    @JsonInclude(NON_NULL)
    private RoleType receiverRole;
    @JsonInclude(NON_NULL)
    @JsonSerialize(converter = CodeTypeToStringConverter.class)
    @JsonDeserialize(converter = StringToCodeTypeConverter.class)
    private CodeType receiverIdType;
    @JsonInclude(NON_NULL)
    private String receiverId;

    @JsonInclude(NON_NULL)
    private String gatewayId;

    @JsonInclude(NON_EMPTY)
    private List<OtherParty> otherReceiver;

    @JsonInclude(NON_NULL)
    private ProcessType processType;
    @JsonInclude(NON_NULL)
    private String processId;

    @JsonProperty("MessageType")
    @JsonSerialize(converter = MessageTypeToStringConverter.class)
    @JsonDeserialize(converter = StringToMessageTypeConverter.class)
    private MessageType messageType;

    @JsonInclude(NON_NULL)
    @JsonUnwrapped
    private T payload;

    public DCSAMessage() {
        otherReceiver = new ArrayList<>();
        processType = ProcessType.PortCall;
        messageType = MessageType.PortCallMessage;
    }

    public OffsetDateTime getMessageDateTime() {
        return messageDateTime;
    }

    public DCSAMessage<T> setMessageDateTime(OffsetDateTime messageDateTime) {
        this.messageDateTime = messageDateTime;
        return this;
    }

    public RoleType getSenderRole() {
        return senderRole;
    }

    public DCSAMessage<T> setSenderRole(RoleType senderRole) {
        this.senderRole = senderRole;
        this.senderIdType = senderRole.getCodeType();
        return this;
    }

    public CodeType getSenderIdType() {
        return senderIdType;
    }

    public DCSAMessage<T> setSenderIdType(CodeType senderIdType) {
        this.senderIdType = senderIdType;
        return this;
    }

    public String getSenderId() {
        return senderId;
    }

    public DCSAMessage<T> setSenderId(String senderId) {
        this.senderId = senderId;
        return this;
    }

    public RoleType getReceiverRole() {
        return receiverRole;
    }

    public DCSAMessage<T> setReceiverRole(RoleType receiverRole) {
        this.receiverRole = receiverRole;
        this.receiverIdType = receiverRole.getCodeType();
        return this;
    }

    public CodeType getReceiverIdType() {
        return receiverIdType;
    }

    public DCSAMessage<T> setReceiverIdType(CodeType receiverIdType) {
        this.receiverIdType = receiverIdType;
        return this;
    }

    public String getReceiverId() {
        return receiverId;
    }

    public DCSAMessage<T> setReceiverId(String receiverId) {
        this.receiverId = receiverId;
        return this;
    }

    public String getGatewayId() {
        return gatewayId;
    }

    public DCSAMessage<T> setGatewayId(String gatewayId) {
        this.gatewayId = gatewayId;
        return this;
    }

    public List<OtherParty> getOtherReceiver() {
        return otherReceiver;
    }

    public DCSAMessage<T> setOtherReceiver(List<OtherParty> otherReceiver) {
        this.otherReceiver = otherReceiver;
        return this;
    }

    public ProcessType getProcessType() {
        return processType;
    }

    public DCSAMessage<T> setProcessType(ProcessType processType) {
        this.processType = processType;
        return this;
    }

    public String getProcessId() {
        return processId;
    }

    public DCSAMessage<T> setProcessId(String processId) {
        this.processId = processId;
        return this;
    }

    public MessageType getMessageType() {
        return messageType;
    }

    public DCSAMessage<T> setMessageType(MessageType messageType) {
        this.messageType = messageType;
        return this;
    }

    public T getPayload() {
        return payload;
    }

    public DCSAMessage<T> setPayload(T payload) {
        this.payload = payload;
        return this;
    }
}
