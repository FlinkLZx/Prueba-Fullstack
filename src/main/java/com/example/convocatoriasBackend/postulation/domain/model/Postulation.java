package com.example.convocatoriasBackend.postulation.domain.model;

import com.example.convocatoriasBackend.convocation.domain.model.Convocation;
import com.example.convocatoriasBackend.user.domain.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Postulation {

    private Long id;

    private Convocation convocation;
    private User student;

    private LocalDateTime postulationDate;

    private PostulationStatus status;
}
