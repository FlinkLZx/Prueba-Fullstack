package com.example.convocatoriasBackend.user.infraestructure.adapters.inbound.rest;

import com.example.convocatoriasBackend.user.domain.model.User;
import com.example.convocatoriasBackend.user.domain.ports.inbound.ConsultUseCase;
import com.example.convocatoriasBackend.user.domain.ports.inbound.CreateUseCase;
import com.example.convocatoriasBackend.user.domain.ports.inbound.DeleteUseCase;
import com.example.convocatoriasBackend.user.domain.ports.inbound.UpdateUseCase;
import com.example.convocatoriasBackend.user.infraestructure.adapters.inbound.rest.dto.UserRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UserController {

    private final CreateUseCase createUseCase;
    private final ConsultUseCase consultUseCase;
    private final UpdateUseCase updateUseCase;
    private final DeleteUseCase deleteUseCase;

    public UserController(CreateUseCase createUseCase, ConsultUseCase consultUseCase, UpdateUseCase updateUseCase, DeleteUseCase deleteUseCase) {
        this.createUseCase = createUseCase;
        this.consultUseCase = consultUseCase;
        this.updateUseCase = updateUseCase;
        this.deleteUseCase = deleteUseCase;
    }

    @GetMapping
    public ResponseEntity<List<User>> List() {
        return ResponseEntity.ok(consultUseCase.listAll());
    }

    @PostMapping
    public ResponseEntity<User> register(@Valid @RequestBody UserRequest request) throws IllegalAccessException {
        User newUser = new User(
                null, request.getIdentification(), request.getName(), request.getEmail(),
                request.getPassword(), request.getRole(), request.getStatus()
        );

        return new ResponseEntity<>(createUseCase.createUser(newUser), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> update(@PathVariable Long id, @Valid @RequestBody UserRequest request) {
        User updatedUser = new User(
                null, request.getIdentification(), request.getName(), request.getEmail(),
                request.getPassword(), request.getRole(), request.getStatus()
        );
        return ResponseEntity.ok(updateUseCase.updateUser(id, updatedUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        deleteUseCase.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

}
