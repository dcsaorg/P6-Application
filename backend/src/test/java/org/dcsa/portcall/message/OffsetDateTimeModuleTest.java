package org.dcsa.portcall.message;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.dcsa.portcall.service.PortCallMessageService;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import static org.assertj.core.api.Assertions.assertThat;

public class OffsetDateTimeModuleTest {

    public static final String DATE_TIME_STRING = "\"2020-11-13T17:25Z\"";
    public static final String JSON = "{\n" +
            "  \"OffsetDateTime\" : " + DATE_TIME_STRING + "\n" +
            "}";
    public static final OffsetDateTime DATE_TIME = OffsetDateTime.of(2020, 11, 13, 17, 25, 31, 43, ZoneOffset.UTC);
    private static ObjectMapper mapper;

    @BeforeAll
    static void before() {
        PortCallMessageService portCallMessageService = new PortCallMessageService();
        mapper = portCallMessageService.getJsonMapper();
    }

    @Test
    void testReadOffsetDateTime() throws Exception {
        assertThat(mapper.readValue(JSON, OffsetDateTime.class)).isEqualTo(DATE_TIME.withSecond(0).withNano(0));
    }

    @Test
    void testWriteOffsetDateTime() throws Exception {
        assertThat(mapper.writeValueAsString(DATE_TIME)).isEqualTo(JSON);
    }
}
