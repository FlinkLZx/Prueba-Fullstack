package com.example.convocatoriasBackend.postulation.domain.ports.outbound;

import com.example.convocatoriasBackend.postulation.domain.model.Postulation;

import java.util.List;
import java.util.Optional;

public interface PostulationRepositoryPort {

    Postulation save(Postulation postulation);
    List<Postulation> findAll();
    Optional<Postulation> findById(Long id);
    Optional<Postulation> findByStudentIdAndConvocationId(Long studentId, Long convocationId);
    long countByConvocationId(Long convocatoriaId);

}
