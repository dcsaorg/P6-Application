package org.dcsa.portcall.message.converter;

import com.fasterxml.jackson.databind.util.StdConverter;
import org.dcsa.portcall.message.MessageType;

public class StringToMessageTypeConverter extends StdConverter<String, MessageType> {
    @Override
    public MessageType convert(String s) {
        return MessageType.valueOf(s);
    }
}
