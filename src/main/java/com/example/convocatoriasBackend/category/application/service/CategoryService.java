package com.example.convocatoriasBackend.category.application.service;

import com.example.convocatoriasBackend.category.domain.model.Category;
import com.example.convocatoriasBackend.category.domain.ports.inbound.ConsultCategoryUseCase;
import com.example.convocatoriasBackend.category.domain.ports.inbound.CreateCategoryUseCase;
import com.example.convocatoriasBackend.category.domain.ports.inbound.DeleteCategoryUseCase;
import com.example.convocatoriasBackend.category.domain.ports.inbound.UpdateCategoryUseCase;
import com.example.convocatoriasBackend.category.domain.ports.outbound.CategoryRepositoryPort;

import java.util.List;
import java.util.Optional;

public class CategoryService implements CreateCategoryUseCase, ConsultCategoryUseCase, UpdateCategoryUseCase, DeleteCategoryUseCase {

    private final CategoryRepositoryPort repositoryPort;

    public CategoryService(CategoryRepositoryPort repositoryPort) {
        this.repositoryPort = repositoryPort;
    }

    @Override
    public Category createCategory(Category category) throws IllegalAccessException {
        if (repositoryPort.findByName(category.getName()).isPresent()) {
            throw new IllegalAccessException("Category with this name already exists");
        }
        return repositoryPort.save(category);
    }

    @Override
    public List<Category> listAll() {
        return repositoryPort.findAll();
    }

    @Override
    public Optional<Category> findById(Long id) {
        return repositoryPort.findById(id);
    }

    @Override
    public Category updateCategory(Long id, Category category) {
        return repositoryPort.update(id, category);
    }

    @Override
    public void deleteCategory(Long id) {
        repositoryPort.delete(id);
    }
}
