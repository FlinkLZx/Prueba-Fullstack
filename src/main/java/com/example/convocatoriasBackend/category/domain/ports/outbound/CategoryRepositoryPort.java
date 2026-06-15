package com.example.convocatoriasBackend.category.domain.ports.outbound;

import com.example.convocatoriasBackend.category.domain.model.Category;

import java.util.List;
import java.util.Optional;

public interface CategoryRepositoryPort {
    Category save(Category category);
    List<Category> findAll();
    Optional<Category> findById(Long id);
    Optional<Category> findByName(String name);
    Category update(Long id, Category category);
    void delete(Long id);
}
