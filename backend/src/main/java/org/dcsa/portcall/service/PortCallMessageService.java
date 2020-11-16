package org.dcsa.portcall.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.module.SimpleModule;
import org.dcsa.portcall.message.serializer.OffsetDateTimeDeserializer;
import org.dcsa.portcall.message.serializer.OffsetDateTimeSerializer;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

@Service
public class PortCallMessageService {

    private ObjectMapper jsonMapper;

    public PortCallMessageService() {
        jsonMapper = new Jackson2ObjectMapperBuilder()
                .indentOutput(true)
                .propertyNamingStrategy(PropertyNamingStrategy.UPPER_CAMEL_CASE)
                .build()
                .configure(SerializationFeature.WRAP_ROOT_VALUE, true);
//                .registerModule(new JavaTimeModule())
//                .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
//                .enable(SerializationFeature.WRITE_DATES_WITH_ZONE_ID)
//                .disable(DeserializationFeature.ADJUST_DATES_TO_CONTEXT_TIME_ZONE);

        SimpleModule module = new SimpleModule();
        module.addSerializer(OffsetDateTime.class, new OffsetDateTimeSerializer());
        module.addDeserializer(OffsetDateTime.class, new OffsetDateTimeDeserializer());
        jsonMapper.registerModule(module);
    }

    public ObjectMapper getJsonMapper() {
        return jsonMapper;
    }
}
