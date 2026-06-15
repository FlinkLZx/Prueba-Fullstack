package com.example.convocatoriasBackend.category.infraestructure.adapters.outbound.database;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SpringDataCategoryRepository extends JpaRepository<CategoryEntity, Long> {
    Optional<CategoryEntity> findByName(String name);
}
