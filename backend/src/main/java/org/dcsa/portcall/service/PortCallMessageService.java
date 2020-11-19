package org.dcsa.portcall.service;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.dcsa.portcall.message.converter.OffsetDateTimeSerializerModule;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.stereotype.Service;

@Service
public class PortCallMessageService {

    private ObjectMapper jsonMapper;

    public PortCallMessageService() {
        jsonMapper = new Jackson2ObjectMapperBuilder()
                .indentOutput(true)
                .propertyNamingStrategy(PropertyNamingStrategy.UPPER_CAMEL_CASE)
                .build()
                .configure(SerializationFeature.WRAP_ROOT_VALUE, true)
                .configure(DeserializationFeature.UNWRAP_ROOT_VALUE, true);
//                .registerModule(new JavaTimeModule())
//                .disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
//                .enable(SerializationFeature.WRITE_DATES_WITH_ZONE_ID)
//                .disable(DeserializationFeature.ADJUST_DATES_TO_CONTEXT_TIME_ZONE);
        jsonMapper.registerModule(new OffsetDateTimeSerializerModule());
    }

    public ObjectMapper getJsonMapper() {
        return jsonMapper;
    }
}
