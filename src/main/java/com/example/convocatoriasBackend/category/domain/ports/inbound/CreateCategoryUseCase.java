package com.example.convocatoriasBackend.category.domain.ports.inbound;

import com.example.convocatoriasBackend.category.domain.model.Category;

public interface CreateCategoryUseCase {
    Category createCategory(Category category) throws IllegalAccessException;
}
