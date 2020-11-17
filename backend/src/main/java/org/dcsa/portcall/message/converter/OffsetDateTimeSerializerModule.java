package org.dcsa.portcall.message.converter;

import com.fasterxml.jackson.core.Version;
import com.fasterxml.jackson.databind.module.SimpleModule;

import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

public class OffsetDateTimeSerializerModule extends SimpleModule {

    public static DateTimeFormatter ISO_8601_FORMATTER = DateTimeFormatter
            .ofPattern("yyyy-MM-dd'T'HH:mm'Z'")
            .withZone(ZoneId.of("UTC"));

    public OffsetDateTimeSerializerModule() {
        super(OffsetDateTimeSerializerModule.class.getSimpleName(), new Version(1,0, 0, null, null, null));
        this.addSerializer(OffsetDateTime.class, new OffsetDateTimeSerializer());
        this.addDeserializer(OffsetDateTime.class, new OffsetDateTimeDeserializer());
    }
}
