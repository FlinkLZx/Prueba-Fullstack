package com.example.convocatoriasBackend.postulation.infraestructure.config;

import com.example.convocatoriasBackend.convocation.domain.ports.outbound.ConvocationRepositoryPort;
import com.example.convocatoriasBackend.postulation.application.service.PostulationService;
import com.example.convocatoriasBackend.postulation.domain.ports.outbound.PostulationRepositoryPort;
import com.example.convocatoriasBackend.user.domain.ports.outbound.UserRepositoryPort;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class PostulationBeanConfig {

    @Bean
    public PostulationService postulationService(PostulationRepositoryPort postulationRepositoryPort,
                                                 ConvocationRepositoryPort convocationRepositoryPort,
                                                 UserRepositoryPort userRepositoryPort) {
        return new PostulationService(
                postulationRepositoryPort,
                convocationRepositoryPort,
                userRepositoryPort
        );
    }

}
