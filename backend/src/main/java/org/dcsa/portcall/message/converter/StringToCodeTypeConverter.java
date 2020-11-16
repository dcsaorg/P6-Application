package org.dcsa.portcall.message.converter;

import com.fasterxml.jackson.databind.util.StdConverter;
import org.dcsa.portcall.message.CodeType;

public class StringToCodeTypeConverter extends StdConverter<String, CodeType> {
    @Override
    public CodeType convert(String s) {
        for (CodeType codeType : CodeType.values()) {
            if (codeType.getName().equals(s)) {
                return codeType;
            }
        }
        throw new IllegalArgumentException("Unexpected code type string '" + s + "'");
    }
}
