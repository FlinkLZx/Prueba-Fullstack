package com.example.convocatoriasBackend.category.infraestructure.adapters.inbound.rest;

import com.example.convocatoriasBackend.category.domain.model.Category;
import com.example.convocatoriasBackend.category.domain.ports.inbound.*;
import com.example.convocatoriasBackend.category.infraestructure.adapters.inbound.rest.dto.CategoryRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = "*")
public class CategoryController {

    private final CreateCategoryUseCase createUseCase;
    private final ConsultCategoryUseCase consultUseCase;
    private final UpdateCategoryUseCase updateUseCase;
    private final DeleteCategoryUseCase deleteUseCase;

    public CategoryController(CreateCategoryUseCase createUseCase, ConsultCategoryUseCase consultUseCase,
                              UpdateCategoryUseCase updateUseCase, DeleteCategoryUseCase deleteUseCase) {
        this.createUseCase = createUseCase;
        this.consultUseCase = consultUseCase;
        this.updateUseCase = updateUseCase;
        this.deleteUseCase = deleteUseCase;
    }

    @GetMapping
    public ResponseEntity<List<Category>> listAll() {
        return ResponseEntity.ok(consultUseCase.listAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> findById(@PathVariable Long id) {
        return consultUseCase.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Category> create(@Valid @RequestBody CategoryRequest request) throws IllegalAccessException {
        Category domain = new Category(null, request.getName());
        Category created = createUseCase.createCategory(domain);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> update(@PathVariable Long id, @Valid @RequestBody CategoryRequest request) {
        Category domain = new Category(null, request.getName());
        Category updated = updateUseCase.updateCategory(id, domain);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        deleteUseCase.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
