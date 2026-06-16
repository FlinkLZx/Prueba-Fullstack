package com.example.convocatoriasBackend.security;

import com.example.convocatoriasBackend.user.domain.model.RoleType;
import com.example.convocatoriasBackend.user.domain.model.StatusType;
import com.example.convocatoriasBackend.user.domain.model.User;
import com.example.convocatoriasBackend.user.domain.ports.outbound.UserRepositoryPort;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepositoryPort userRepositoryPort;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepositoryPort userRepositoryPort, PasswordEncoder passwordEncoder) {
        this.userRepositoryPort = userRepositoryPort;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepositoryPort.findByEmail("admin@usco.edu.co").isEmpty()) {
            User admin = new User();
            admin.setIdentification("1000000000");
            admin.setName("Admin Principal");
            admin.setEmail("admin@usco.edu.co");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole(RoleType.ADMINISTRADOR);
            admin.setStatus(StatusType.ACTIVO);
            userRepositoryPort.saveUser(admin);
            System.out.println("Default admin user created: admin@usco.edu.co / admin123");
        }
    }
}
