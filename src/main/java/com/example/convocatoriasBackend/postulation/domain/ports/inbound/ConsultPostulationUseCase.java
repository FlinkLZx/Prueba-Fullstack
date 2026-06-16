package com.example.convocatoriasBackend.postulation.domain.ports.inbound;

import com.example.convocatoriasBackend.postulation.domain.model.Postulation;

import java.util.List;
import java.util.Optional;

public interface ConsultPostulationUseCase {
    List<Postulation> listAll();
    Optional<Postulation> findById(Long id);
}
