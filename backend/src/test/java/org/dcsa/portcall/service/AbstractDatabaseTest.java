package org.dcsa.portcall.service;

import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.util.TestPropertyValues;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.test.context.ContextConfiguration;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

import javax.validation.constraints.NotNull;
import java.util.Map;

@ContextConfiguration(initializers = AbstractDatabaseTest.Initializer.class)
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@Testcontainers
public abstract class AbstractDatabaseTest {

    @Autowired
    @SuppressWarnings("SpringJavaInjectionPointsAutowiringInspection")
    protected DSLContext dsl;

    @Container
    private static final PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>(
            DockerImageName.parse("registry.ponton.de/postgres:10-alpine").asCompatibleSubstituteFor("postgres"))
            .withDatabaseName("dcsa")
            .withUsername("dcsa")
            .withPassword("dcsapw");

    public static class Initializer implements ApplicationContextInitializer<ConfigurableApplicationContext> {

        @Override
        @SuppressWarnings("NullableProblems")
        public void initialize(@NotNull ConfigurableApplicationContext configurableApplicationContext) {
            TestPropertyValues testPropertyValues = TestPropertyValues.of(Map.of(
                    "spring.datasource.url", postgres.getJdbcUrl(),
                    "spring.datasource.username", postgres.getUsername(),
                    "spring.datasource.password", postgres.getPassword(),
                    "spring.datasource.hikari.maxLifetime", "600000",
                    "spring.flyway.url", postgres.getJdbcUrl(),
                    "spring.flyway.username", postgres.getUsername(),
                    "spring.flyway.password", postgres.getPassword()
            ));
            testPropertyValues.applyTo(configurableApplicationContext);
        }
    }
}
