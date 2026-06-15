package com.example.convocatoriasBackend.user.application.service;

import com.example.convocatoriasBackend.user.domain.model.StatusType;
import com.example.convocatoriasBackend.user.domain.model.User;
import com.example.convocatoriasBackend.user.domain.ports.inbound.ConsultUseCase;
import com.example.convocatoriasBackend.user.domain.ports.inbound.CreateUseCase;
import com.example.convocatoriasBackend.user.domain.ports.inbound.DeleteUseCase;
import com.example.convocatoriasBackend.user.domain.ports.inbound.UpdateUseCase;
import com.example.convocatoriasBackend.user.domain.ports.outbound.UserRepositoryPort;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

public class UserService implements ConsultUseCase, CreateUseCase, UpdateUseCase, DeleteUseCase {

    private final UserRepositoryPort repositoryPort;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepositoryPort repositoryPort, PasswordEncoder passwordEncoder) {
        this.repositoryPort = repositoryPort;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User createUser(User user) throws IllegalAccessException {
        if (repositoryPort.findByEmail(user.getEmail()).isPresent()) {
            throw new IllegalAccessException("Email already on use");
        }
        user.setStatus(StatusType.ACTIVO);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return repositoryPort.saveUser(user);
    }

    @Override
    public List<User> listAll() {
        return repositoryPort.findAll();
    }

    @Override
    public User updateUser(long id, User user) {
        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        return repositoryPort.updateUser(id, user);
    }

    @Override
    public void deleteUser(long id) {
        repositoryPort.deleteUser(id);
    }

}
