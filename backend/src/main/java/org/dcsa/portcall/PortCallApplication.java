package org.dcsa.portcall;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@EnableTransactionManagement
@EnableConfigurationProperties(PortCallProperties.class)
public class PortCallApplication {

    public static void main(String[] args) {
        SpringApplication.run(PortCallApplication.class, args);
    }
}
