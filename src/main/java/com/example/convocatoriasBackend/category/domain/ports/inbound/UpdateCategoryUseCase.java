package com.example.convocatoriasBackend.category.domain.ports.inbound;

import com.example.convocatoriasBackend.category.domain.model.Category;

public interface UpdateCategoryUseCase {
    Category updateCategory(Long id, Category category);
}
