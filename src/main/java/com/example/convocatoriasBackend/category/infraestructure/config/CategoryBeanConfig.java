package com.example.convocatoriasBackend.category.infraestructure.config;

import com.example.convocatoriasBackend.category.application.service.CategoryService;
import com.example.convocatoriasBackend.category.domain.ports.outbound.CategoryRepositoryPort;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class CategoryBeanConfig {

    @Bean
    public CategoryService categoryService(CategoryRepositoryPort repositoryPort) {
        return new CategoryService(repositoryPort);
    }
}
