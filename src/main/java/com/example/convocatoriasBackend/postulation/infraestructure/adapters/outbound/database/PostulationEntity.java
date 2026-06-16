package com.example.convocatoriasBackend.postulation.infraestructure.adapters.outbound.database;

import com.example.convocatoriasBackend.convocation.infraestructure.adapters.outbound.database.ConvocationEntity;
import com.example.convocatoriasBackend.postulation.domain.model.PostulationStatus;
import com.example.convocatoriasBackend.user.infraestructure.adapters.outbound.database.UserEntity;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "postulaciones", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"estudiante_id", "convocatoria_id"})
})
public class PostulationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "convocatoria_id", nullable = false)
    private ConvocationEntity convocation;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "estudiante_id", nullable = false)
    private UserEntity student;

    @Column(name = "fecha_postulacion", nullable = false)
    private LocalDateTime postulationDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PostulationStatus status;
}
