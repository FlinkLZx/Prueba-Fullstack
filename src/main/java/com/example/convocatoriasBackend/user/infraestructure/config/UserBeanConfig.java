package com.example.convocatoriasBackend.user.infraestructure.config;

import com.example.convocatoriasBackend.user.application.service.UserService;
import com.example.convocatoriasBackend.user.domain.ports.outbound.UserRepositoryPort;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class UserBeanConfig {

    @Bean
    public UserService userService(UserRepositoryPort repositoryPort, PasswordEncoder passwordEncoder) {
        return new UserService(repositoryPort, passwordEncoder);
    }

}
