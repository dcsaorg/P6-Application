package org.dcsa.portcall.message.serializer;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;

import java.io.IOException;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

public class OffsetDateTimeSerializer extends JsonSerializer<OffsetDateTime>
{
    private static final DateTimeFormatter ISO_8601_FORMATTER = DateTimeFormatter
            .ofPattern("yyyy-MM-dd'T'HH:mm'Z'")
            .withZone(ZoneId.of("UTC"));

    @Override
    public void serialize(OffsetDateTime value, JsonGenerator jsonGenerator, SerializerProvider serializerProvider) throws IOException
    {
        if (value == null) {
            throw new IOException("OffsetDateTime argument is null.");
        }

        jsonGenerator.writeString(ISO_8601_FORMATTER.format(value));
    }
}
