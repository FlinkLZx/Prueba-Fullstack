package com.example.convocatoriasBackend.convocation.infraestructure.adapters.inbound.rest;

import com.example.convocatoriasBackend.category.domain.model.Category;
import com.example.convocatoriasBackend.convocation.domain.model.Convocation;
import com.example.convocatoriasBackend.convocation.domain.ports.inbound.*;
import com.example.convocatoriasBackend.convocation.infraestructure.adapters.inbound.rest.dto.ConvocationRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/convocatorias")
@CrossOrigin(origins = "*")
public class ConvocationController {

    private final CreateConvocationUseCase createUseCase;
    private final ConsultConvocationUseCase consultUseCase;
    private final UpdateConvocationUseCase updateUseCase;
    private final DeleteConvocationUseCase deleteUseCase;

    public ConvocationController(CreateConvocationUseCase createUseCase, ConsultConvocationUseCase consultUseCase,
                                 UpdateConvocationUseCase updateUseCase, DeleteConvocationUseCase deleteUseCase) {
        this.createUseCase = createUseCase;
        this.consultUseCase = consultUseCase;
        this.updateUseCase = updateUseCase;
        this.deleteUseCase = deleteUseCase;
    }

    @GetMapping
    public ResponseEntity<List<Convocation>> listAll() {
        return ResponseEntity.ok(consultUseCase.listAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Convocation> findById(@PathVariable Long id) {
        return consultUseCase.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Convocation> create(@Valid @RequestBody ConvocationRequest request) {
        Convocation domain = toDomain(request);
        Convocation created = createUseCase.createConvocation(domain);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Convocation> update(@PathVariable Long id, @Valid @RequestBody ConvocationRequest request) {
        Convocation domain = toDomain(request);
        Convocation updated = updateUseCase.updateConvocation(id, domain);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        deleteUseCase.deleteConvocation(id);
        return ResponseEntity.noContent().build();
    }

    private Convocation toDomain(ConvocationRequest request) {
        List<Category> cats = request.getCategoryIds() != null ?
                request.getCategoryIds().stream()
                        .map(cid -> new Category(cid, null))
                        .collect(Collectors.toList()) : Collections.emptyList();

        return new Convocation(
                null,
                request.getName(),
                request.getDescription(),
                request.getStartDate(),
                request.getFinishDate(),
                request.getSpotsAvailable(),
                request.getStatus(),
                cats
        );
    }
}
