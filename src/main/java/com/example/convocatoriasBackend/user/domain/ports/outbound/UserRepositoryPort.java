package com.example.convocatoriasBackend.user.domain.ports.outbound;

import com.example.convocatoriasBackend.user.domain.model.User;

import java.util.List;
import java.util.Optional;

public interface UserRepositoryPort {

    User saveUser(User user);
    List<User> findAll();
    User updateUser(User user);
    Optional<User> findByEmail(String email);
    void deleteUser(Long id);

}
