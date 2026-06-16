package com.example.convocatoriasBackend.postulation.domain.ports.inbound;

import com.example.convocatoriasBackend.postulation.domain.model.Postulation;
import com.example.convocatoriasBackend.postulation.domain.model.PostulationStatus;

public interface UpdatePostulationStatusUseCase {
    Postulation updateStatus(Long id, PostulationStatus status);
}
