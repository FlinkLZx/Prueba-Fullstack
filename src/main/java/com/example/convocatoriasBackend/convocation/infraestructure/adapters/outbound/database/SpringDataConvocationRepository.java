package com.example.convocatoriasBackend.convocation.infraestructure.adapters.outbound.database;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SpringDataConvocationRepository extends JpaRepository<ConvocationEntity, Long> {
}
