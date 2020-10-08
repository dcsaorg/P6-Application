package org.dcsa.portcall;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PortCallApplication {

    public static void main(String[] args) { // (1)
        SpringApplication.run(PortCallApplication.class, args);
    }
}
