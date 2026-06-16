package com.example.convocatoriasBackend.postulation.domain.ports.inbound;

import com.example.convocatoriasBackend.postulation.domain.model.Postulation;

public interface CreatePostulationUseCase {
    Postulation createPostulation(Postulation postulation) throws IllegalAccessException;
}
