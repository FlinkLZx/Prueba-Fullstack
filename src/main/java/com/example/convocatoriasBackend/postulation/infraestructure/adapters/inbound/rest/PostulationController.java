package com.example.convocatoriasBackend.postulation.infraestructure.adapters.inbound.rest;

import com.example.convocatoriasBackend.convocation.domain.model.Convocation;
import com.example.convocatoriasBackend.postulation.domain.model.Postulation;
import com.example.convocatoriasBackend.postulation.domain.ports.inbound.ConsultPostulationUseCase;
import com.example.convocatoriasBackend.postulation.domain.ports.inbound.CreatePostulationUseCase;
import com.example.convocatoriasBackend.postulation.domain.ports.inbound.UpdatePostulationStatusUseCase;
import com.example.convocatoriasBackend.postulation.infraestructure.adapters.inbound.rest.dto.PostulationRequest;
import com.example.convocatoriasBackend.postulation.infraestructure.adapters.inbound.rest.dto.StatusUpdateRequest;
import com.example.convocatoriasBackend.user.domain.model.User;
import jakarta.validation.Valid;
import lombok.Lombok;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/postulaciones")
@CrossOrigin(origins = "*")
public class PostulationController {

    private final CreatePostulationUseCase createUseCase;
    private final ConsultPostulationUseCase consultUseCase;
    private final UpdatePostulationStatusUseCase updateStatusUseCase;

    public PostulationController(CreatePostulationUseCase createUseCase, ConsultPostulationUseCase consultUseCase, UpdatePostulationStatusUseCase updateStatusUseCase) {
        this.createUseCase = createUseCase;
        this.consultUseCase = consultUseCase;
        this.updateStatusUseCase = updateStatusUseCase;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ESTUDIANTE', 'ADMINISTRADOR')")
    public ResponseEntity<Postulation> create(@Valid @RequestBody PostulationRequest request) throws IllegalAccessException {
        Postulation domainModel = new Postulation();

        User student = new User();
        student.setId(request.getStudentId());
        domainModel.setStudent(student);

        Convocation conv = new Convocation();
        conv.setId(request.getConvocationId());
        domainModel.setConvocation(conv);

        Postulation saved = createUseCase.createPostulation(domainModel);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'DOCENTE')")
    public ResponseEntity<List<Postulation>> getAll() {
        return ResponseEntity.ok(consultUseCase.listAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'DOCENTE', 'ESTUDIANTE')")
    public ResponseEntity<Postulation> getById(@PathVariable Long id) {
        return consultUseCase.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMINISTRADOR')")
    public ResponseEntity<Postulation> updateStatus(@PathVariable Long id, @Valid @RequestBody StatusUpdateRequest request) {
        Postulation updated = updateStatusUseCase.updateStatus(id, request.getStatus());
        return ResponseEntity.ok(updated);
    }

}
