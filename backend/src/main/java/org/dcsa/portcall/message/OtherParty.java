package org.dcsa.portcall.message;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import org.dcsa.portcall.message.converter.CodeTypeToStringConverter;
import org.dcsa.portcall.message.converter.StringToCodeTypeConverter;

import static com.fasterxml.jackson.annotation.JsonInclude.Include.NON_NULL;

public class OtherParty {

    private RoleType otherReceiverRole;
    @JsonInclude(NON_NULL)
    @JsonSerialize(converter = CodeTypeToStringConverter.class)
    @JsonDeserialize(converter = StringToCodeTypeConverter.class)
    private CodeType otherReceiverIdType;
    @JsonInclude(NON_NULL)
    private String otherReceiverId;

    public RoleType getOtherReceiverRole() {
        return otherReceiverRole;
    }

    public OtherParty setOtherReceiverRole(RoleType otherReceiverRole) {
        this.otherReceiverRole = otherReceiverRole;
        this.otherReceiverIdType = otherReceiverRole.getCodeType();
        return this;
    }

    public CodeType getOtherReceiverIdType() {
        return otherReceiverIdType;
    }

    public OtherParty setOtherReceiverIdType(CodeType otherReceiverIdType) {
        this.otherReceiverIdType = otherReceiverIdType;
        return this;
    }

    public String getOtherReceiverId() {
        return otherReceiverId;
    }

    public OtherParty setOtherReceiverId(String otherReceiverId) {
        this.otherReceiverId = otherReceiverId;
        return this;
    }
}
