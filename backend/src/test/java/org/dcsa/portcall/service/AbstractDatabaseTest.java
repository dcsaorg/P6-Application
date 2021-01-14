package org.dcsa.portcall.service;

import org.jooq.DSLContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.containers.output.Slf4jLogConsumer;
import org.testcontainers.containers.wait.strategy.Wait;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.utility.DockerImageName;

@Testcontainers
public abstract class AbstractDatabaseTest {

    private static final Logger log = LoggerFactory.getLogger(AbstractDatabaseTest.class);

    @Autowired
    protected DSLContext dsl;

    private static final PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>(
            DockerImageName.parse("postgres:10-alpine").asCompatibleSubstituteFor("postgres"))
            .withDatabaseName("dcsa")
            .withUsername("dcsa")
            .withPassword("dcsapw").withLogConsumer(new Slf4jLogConsumer(log))
            .waitingFor(
                    Wait.forLogMessage(".*database system is ready to accept connections.*\\n", 1)
            );

    static {
        postgres.start();
    }

    @DynamicPropertySource
    static void dynamicProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
        registry.add("spring.flyway.url", postgres::getJdbcUrl);
        registry.add("spring.flyway.username", postgres::getUsername);
        registry.add("spring.flyway.password", postgres::getPassword);
    }
}
