package com.example.convocatoriasBackend.user.infraestructure.adapters.outbound.database;

import com.example.convocatoriasBackend.user.domain.model.User;
import com.example.convocatoriasBackend.user.domain.ports.outbound.UserRepositoryPort;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class UserPersistenceAdapter implements UserRepositoryPort {

    private final SpringDataUserRepository springDataRepository;

    public UserPersistenceAdapter(SpringDataUserRepository springDataRepository) {
        this.springDataRepository = springDataRepository;
    }


    @Override
    public User saveUser(User user) {
        UserEntity entity = toEntity(user);
        UserEntity savedEntity = springDataRepository.save(entity);
        return toDomain(savedEntity);
    }

    @Override
    public List<User> findAll() {
        return springDataRepository.findAll().stream()
                .map(this::toDomain).collect(Collectors.toList());
    }

    @Override
    public User updateUser(Long id, User updatedUser) {
        UserEntity existingUser = springDataRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id " + id));

        Optional<UserEntity> userWithExistingEmail = springDataRepository.findByEmail(updatedUser.getEmail());
        if (userWithExistingEmail.isPresent() && !userWithExistingEmail.get().getId().equals(id)) {
            throw new IllegalArgumentException("Email already on use");
        }

        existingUser.setIdentification(updatedUser.getIdentification());
        existingUser.setName(updatedUser.getName());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setRole(updatedUser.getRole());
        
        if (updatedUser.getStatus() != null) {
            existingUser.setStatus(updatedUser.getStatus());
        }

        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isBlank()) {
            existingUser.setPassword(updatedUser.getPassword());
        }

        UserEntity savedEntity = springDataRepository.save(existingUser);
        return toDomain(savedEntity);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return springDataRepository.findByEmail(email)
                .map(this::toDomain);
    }

    @Override
    public Optional<User> findById(Long id) {
        return springDataRepository.findById(id)
                .map(this::toDomain);
    }

    @Override
    public void deleteUser(Long id) {
        UserEntity existingUser = springDataRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id " + id));
        springDataRepository.delete(existingUser);
    }

    private UserEntity toEntity(User domain) {
        UserEntity entity = new UserEntity();

        entity.setId(domain.getId());
        entity.setName(domain.getName());
        entity.setIdentification(domain.getIdentification());
        entity.setEmail(domain.getEmail());
        entity.setPassword(domain.getPassword());
        entity.setRole(domain.getRole());
        entity.setStatus(domain.getStatus());

        return entity;
    }

    private User toDomain(UserEntity entity) {
        return new User(
                entity.getId(), entity.getIdentification(), entity.getName(), entity.getEmail(),
                entity.getPassword(), entity.getRole(), entity.getStatus()
        );
    }
}
