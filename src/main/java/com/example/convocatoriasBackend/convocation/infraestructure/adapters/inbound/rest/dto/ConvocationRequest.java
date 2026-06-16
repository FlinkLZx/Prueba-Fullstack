package com.example.convocatoriasBackend.convocation.infraestructure.adapters.inbound.rest.dto;

import com.example.convocatoriasBackend.convocation.domain.model.ConvocationStatus;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class ConvocationRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Start date is required")
    private LocalDate startDate;

    @NotNull(message = "Finish date is required")
    private LocalDate finishDate;

    @NotNull(message = "Spots available is required")
    @Min(value = 1, message = "Spots available must be at least 1")
    private Integer spotsAvailable;

    @NotNull(message = "Status is required")
    private ConvocationStatus status;

    private List<Long> categoryIds;
}
