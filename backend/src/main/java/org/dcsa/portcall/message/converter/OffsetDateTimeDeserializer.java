package org.dcsa.portcall.message.converter;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;

public class OffsetDateTimeDeserializer extends JsonDeserializer<OffsetDateTime> {

    @Override
    public OffsetDateTime deserialize(JsonParser p, DeserializationContext ctxt) throws IOException, JsonProcessingException {
        LocalDateTime datetime = LocalDateTime.parse(p.getText(), OffsetDateTimeSerializerModule.ISO_8601_FORMATTER);
        ZonedDateTime zoned = datetime.atZone(ZoneId.of("UTC"));
        return zoned.toOffsetDateTime();
    }
}
