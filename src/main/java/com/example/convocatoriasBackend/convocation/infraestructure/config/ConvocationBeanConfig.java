package com.example.convocatoriasBackend.convocation.infraestructure.config;

import com.example.convocatoriasBackend.convocation.application.service.ConvocationService;
import com.example.convocatoriasBackend.convocation.domain.ports.outbound.ConvocationRepositoryPort;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ConvocationBeanConfig {

    @Bean
    public ConvocationService convocationService(ConvocationRepositoryPort repositoryPort) {
        return new ConvocationService(repositoryPort);
    }
}
