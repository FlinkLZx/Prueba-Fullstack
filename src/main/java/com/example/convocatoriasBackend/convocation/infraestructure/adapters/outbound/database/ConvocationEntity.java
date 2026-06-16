package com.example.convocatoriasBackend.convocation.infraestructure.adapters.outbound.database;

import com.example.convocatoriasBackend.category.infraestructure.adapters.outbound.database.CategoryEntity;
import com.example.convocatoriasBackend.convocation.domain.model.ConvocationStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Entity
@Table(name = "convocatorias")
public class ConvocationEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "fecha_inicio", nullable = false)
    private LocalDate startDate;

    @Column(name = "fecha_fin", nullable = false)
    private LocalDate finishDate;

    @Column(name = "cupos_disponibles", nullable = false)
    private Integer spotsAvailable;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ConvocationStatus status;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "convocatorias_categorias",
            joinColumns = @JoinColumn(name = "convocatoria_id"),
            inverseJoinColumns = @JoinColumn(name = "categoria_id")
    )
    private List<CategoryEntity> categories;
}
