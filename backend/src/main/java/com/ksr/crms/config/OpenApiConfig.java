package com.ksr.crms.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Campus Resource Management System API")
                        .version("1.0.0")
                        .description("REST API for managing campus resources, users, and bookings")
                        .contact(new Contact()
                                .name("Team 22")
                                .email("team22@ksr.edu")))
                .servers(List.of(
                        new Server().url("http://localhost:8080").description("Local Development Server"),
                        new Server().url("https://api.crms.ksr.edu").description("Production Server")
                ));
    }
}
