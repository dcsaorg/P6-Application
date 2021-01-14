package org.dcsa.portcall;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.annotation.PostConstruct;
import java.nio.file.Files;
import java.nio.file.Path;

@Configuration
@ComponentScan("org.dcsa.portcall")
public class PortCallConfiguration {

    private static final Logger log = LogManager.getLogger(PortCallConfiguration.class);

    private final PortCallProperties config;

    public PortCallConfiguration(@Autowired PortCallProperties config) {
        this.config = config;
    }

    @PostConstruct
    public void initHotfolder() throws Exception {
        Path inbox = Path.of(config.getHotfolder().getInbox());
        log.info("Initializing hotfolder inbox: {}", inbox.toAbsolutePath());
        Files.createDirectories(inbox);

        Path outbox = Path.of(config.getHotfolder().getOutbox());
        log.info("Initializing hotfolder outbox: {}", outbox.toAbsolutePath());
        Files.createDirectories(outbox);
    }

    @Bean
    public WebMvcConfigurer configurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedMethods("*")
                        .allowedOrigins("*");
            }
        };
    }
}
