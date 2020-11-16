package org.dcsa.portcall.message.converter;

import com.fasterxml.jackson.databind.util.StdConverter;
import org.dcsa.portcall.message.CodeType;

public class CodeTypeToStringConverter extends StdConverter<CodeType, String> {
    @Override
    public String convert(CodeType codeType) {
        return codeType.getName();
    }
}
