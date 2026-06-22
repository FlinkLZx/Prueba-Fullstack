package com.example.convocatoriasBackend.postulation.infraestructure.adapters.inbound.rest.dto;

import com.example.convocatoriasBackend.postulation.domain.model.PostulationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class StatusUpdateRequest {

    @NotNull(message = "status is required")
    private PostulationStatus status;

}
