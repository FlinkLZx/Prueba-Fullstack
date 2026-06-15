package com.example.convocatoriasBackend.category.domain.ports.inbound;

import com.example.convocatoriasBackend.category.domain.model.Category;

import java.util.List;
import java.util.Optional;

public interface ConsultCategoryUseCase {
    List<Category> listAll();
    Optional<Category> findById(Long id);
}
