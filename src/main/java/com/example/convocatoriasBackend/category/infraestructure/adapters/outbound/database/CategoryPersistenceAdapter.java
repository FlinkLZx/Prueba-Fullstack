package com.example.convocatoriasBackend.category.infraestructure.adapters.outbound.database;

import com.example.convocatoriasBackend.category.domain.model.Category;
import com.example.convocatoriasBackend.category.domain.ports.outbound.CategoryRepositoryPort;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class CategoryPersistenceAdapter implements CategoryRepositoryPort {

    private final SpringDataCategoryRepository repository;

    public CategoryPersistenceAdapter(SpringDataCategoryRepository repository) {
        this.repository = repository;
    }

    @Override
    public Category save(Category category) {
        CategoryEntity entity = toEntity(category);
        CategoryEntity saved = repository.save(entity);
        return toDomain(saved);
    }

    @Override
    public List<Category> findAll() {
        return repository.findAll().stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    public Optional<Category> findById(Long id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    public Optional<Category> findByName(String name) {
        return repository.findByName(name).map(this::toDomain);
    }

    @Override
    public Category update(Long id, Category updated) {
        CategoryEntity existing = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found with id " + id));
        existing.setName(updated.getName());
        CategoryEntity saved = repository.save(existing);
        return toDomain(saved);
    }

    @Override
    public void delete(Long id) {
        CategoryEntity existing = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found with id " + id));
        repository.delete(existing);
    }

    private CategoryEntity toEntity(Category domain) {
        CategoryEntity entity = new CategoryEntity();
        entity.setId(domain.getId());
        entity.setName(domain.getName());
        return entity;
    }

    private Category toDomain(CategoryEntity entity) {
        return new Category(entity.getId(), entity.getName());
    }
}
