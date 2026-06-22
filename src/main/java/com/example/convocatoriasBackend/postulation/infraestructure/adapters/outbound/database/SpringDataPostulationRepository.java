package com.example.convocatoriasBackend.postulation.infraestructure.adapters.outbound.database;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SpringDataPostulationRepository extends JpaRepository<PostulationEntity, Long> {

    Optional<PostulationEntity> findByStudentIdAndConvocationId(Long studentId, Long convocationId);

}
