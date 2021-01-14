package org.dcsa.portcall.message.converter;

import com.fasterxml.jackson.databind.util.StdConverter;
import org.dcsa.portcall.message.MessageType;

public class MessageTypeToStringConverter extends StdConverter<MessageType, String> {
    @Override
    public String convert(MessageType messageType) {
        return messageType.name();
    }
}
