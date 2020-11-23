package org.dcsa.portcall.service.persistence;

import org.dcsa.portcall.db.enums.MessageDirection;
import org.dcsa.portcall.db.tables.pojos.Message;
import org.jooq.DSLContext;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jooq.JooqTest;
import org.springframework.boot.test.util.TestPropertyValues;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.test.context.ContextConfiguration;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import javax.validation.constraints.NotNull;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.dcsa.portcall.db.Tables.MESSAGE;

@ContextConfiguration(initializers = MessageServiceTest.Initializer.class)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@JooqTest
@Testcontainers
class MessageServiceTest {

    public static final String TEST_MESSAGE_CONTENT = "test";

    @Autowired
    private DSLContext dsl;

    @Container
    private static final PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>(
            DockerImageName.parse("registry.ponton.de/postgres:10-alpine").asCompatibleSubstituteFor("postgres"))
            .withDatabaseName("dcsa")
            .withUsername("dcsa")
            .withPassword("dcsapw");

    public static class Initializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {

        @Override
        public void initialize(@NotNull ConfigurableApplicationContext configurableApplicationContext) {
            TestPropertyValues testPropertyValues = TestPropertyValues.of(Map.of(
                    "spring.datasource.url", postgres.getJdbcUrl(),
                    "spring.datasource.username", postgres.getUsername(),
                    "spring.datasource.password", postgres.getPassword(),
                    "spring.flyway.url", postgres.getJdbcUrl(),
                    "spring.flyway.username", postgres.getUsername(),
                    "spring.flyway.password", postgres.getPassword()
            ));
            testPropertyValues.applyTo(configurableApplicationContext);
        }
    }

    @Test
    void testService() throws Exception {
        try {
            Path file = Files.createTempFile(this.getClass().getSimpleName(), ".txt");
            Files.write(file, TEST_MESSAGE_CONTENT.getBytes());
            MessageService service = new MessageService(dsl);
            Optional<Message> messageWritten = service.saveMessage(1, MessageDirection.outbound, file);
            assertThat(messageWritten.isPresent()).isTrue();

            Optional<Message> messageRead = service.findMessage(messageWritten.get().getId());
            assertThat(messageRead.isPresent()).isTrue();
            assertThat(messageRead.get().getId()).isEqualTo(messageWritten.get().getId());
            assertThat(messageRead.get().getDirection()).isEqualTo(messageWritten.get().getDirection());
            assertThat(messageRead.get().getTimestampId()).isEqualTo(messageWritten.get().getTimestampId());
            assertThat(messageRead.get().getFilename()).isEqualTo(messageWritten.get().getFilename());
            assertThat(messageRead.get().getPayload()).isEqualTo(TEST_MESSAGE_CONTENT.getBytes());
        } finally {
            dsl.deleteFrom(MESSAGE);
        }
    }
}