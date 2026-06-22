package com.example.convocatoriasBackend.postulation.infraestructure.adapters.inbound.rest.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PostulationRequest {

    @NotNull(message = "studentId is required")
    private Long studentId;

    @NotNull(message = "convocationId is required")
    private Long convocationId;

}
