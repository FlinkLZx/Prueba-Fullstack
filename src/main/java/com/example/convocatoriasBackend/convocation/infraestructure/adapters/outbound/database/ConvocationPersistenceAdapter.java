package com.example.convocatoriasBackend.convocation.infraestructure.adapters.outbound.database;

import com.example.convocatoriasBackend.category.domain.model.Category;
import com.example.convocatoriasBackend.category.infraestructure.adapters.outbound.database.CategoryEntity;
import com.example.convocatoriasBackend.category.infraestructure.adapters.outbound.database.SpringDataCategoryRepository;
import com.example.convocatoriasBackend.convocation.domain.model.Convocation;
import com.example.convocatoriasBackend.convocation.domain.ports.outbound.ConvocationRepositoryPort;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class ConvocationPersistenceAdapter implements ConvocationRepositoryPort {

    private final SpringDataConvocationRepository repository;
    private final SpringDataCategoryRepository categoriaRepository;

    public ConvocationPersistenceAdapter(SpringDataConvocationRepository repository, SpringDataCategoryRepository categoriaRepository) {
        this.repository = repository;
        this.categoriaRepository = categoriaRepository;
    }

    @Override
    @Transactional
    public Convocation save(Convocation convocation) {
        ConvocationEntity entity = toEntity(convocation);
        ConvocationEntity saved = repository.save(entity);
        return toDomain(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Convocation> findAll() {
        return repository.findAll().stream()
                .map(this::toDomain)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Convocation> findById(Long id) {
        return repository.findById(id).map(this::toDomain);
    }

    @Override
    @Transactional
    public Convocation update(Long id, Convocation updated) {
        ConvocationEntity existing = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Convocation not found with id " + id));

        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setStartDate(updated.getStartDate());
        existing.setFinishDate(updated.getFinishDate());
        existing.setSpotsAvailable(updated.getSpotsAvailable());
        existing.setStatus(updated.getStatus());

        if (updated.getCategories() != null) {
            List<CategoryEntity> categoryEntities = updated.getCategories().stream()
                    .map(cat -> categoriaRepository.findById(cat.getId())
                            .orElseThrow(() -> new IllegalArgumentException("Category not found with id " + cat.getId())))
                    .collect(Collectors.toList());
            existing.setCategories(categoryEntities);
        }

        ConvocationEntity saved = repository.save(existing);
        return toDomain(saved);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        ConvocationEntity existing = repository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Convocation not found with id " + id));
        repository.delete(existing);
    }

    private ConvocationEntity toEntity(Convocation domain) {
        ConvocationEntity entity = new ConvocationEntity();
        entity.setId(domain.getId());
        entity.setName(domain.getName());
        entity.setDescription(domain.getDescription());
        entity.setStartDate(domain.getStartDate());
        entity.setFinishDate(domain.getFinishDate());
        entity.setSpotsAvailable(domain.getSpotsAvailable());
        entity.setStatus(domain.getStatus());

        if (domain.getCategories() != null) {
            List<CategoryEntity> catEntities = domain.getCategories().stream()
                    .map(cat -> categoriaRepository.findById(cat.getId())
                            .orElseThrow(() -> new IllegalArgumentException("Category not found with id " + cat.getId())))
                    .collect(Collectors.toList());
            entity.setCategories(catEntities);
        } else {
            entity.setCategories(new ArrayList<>());
        }

        return entity;
    }

    private Convocation toDomain(ConvocationEntity entity) {
        List<Category> cats = entity.getCategories().stream()
                .map(catEnt -> new Category(catEnt.getId(), catEnt.getName()))
                .collect(Collectors.toList());

        return new Convocation(
                entity.getId(),
                entity.getName(),
                entity.getDescription(),
                entity.getStartDate(),
                entity.getFinishDate(),
                entity.getSpotsAvailable(),
                entity.getStatus(),
                cats
        );
    }
}
