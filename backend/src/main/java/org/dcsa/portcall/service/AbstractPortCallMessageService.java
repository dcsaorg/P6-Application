package org.dcsa.portcall.service;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.dcsa.portcall.message.converter.OffsetDateTimeSerializerModule;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

import java.util.Optional;

public abstract class AbstractPortCallMessageService<IN, OUT> {

    private final ObjectMapper jsonMapper;

    public AbstractPortCallMessageService() {
        jsonMapper = new Jackson2ObjectMapperBuilder()
                .indentOutput(true)
                .propertyNamingStrategy(PropertyNamingStrategy.UPPER_CAMEL_CASE)
                .build()
                .configure(SerializationFeature.WRAP_ROOT_VALUE, true)
                .configure(DeserializationFeature.UNWRAP_ROOT_VALUE, true);
        jsonMapper.registerModule(new OffsetDateTimeSerializerModule());
    }

    public ObjectMapper getJsonMapper() {
        return jsonMapper;
    }

    public abstract Optional<OUT> process(IN message);
}
