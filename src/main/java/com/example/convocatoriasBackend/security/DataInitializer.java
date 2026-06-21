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

        if (userRepositoryPort.findByEmail("docente@usco.edu.co").isEmpty()) {
            User docente = new User();
            docente.setIdentification("2000000000");
            docente.setName("Docente Principal");
            docente.setEmail("docente@usco.edu.co");
            docente.setPassword(passwordEncoder.encode("docente123"));
            docente.setRole(RoleType.DOCENTE);
            docente.setStatus(StatusType.ACTIVO);
            userRepositoryPort.saveUser(docente);
            System.out.println("Default docente user created: docente@usco.edu.co / docente123");
        }

        if (userRepositoryPort.findByEmail("estudiante@usco.edu.co").isEmpty()) {
            User estudiante = new User();
            estudiante.setIdentification("3000000000");
            estudiante.setName("Estudiante Principal");
            estudiante.setEmail("estudiante@usco.edu.co");
            estudiante.setPassword(passwordEncoder.encode("estudiante123"));
            estudiante.setRole(RoleType.ESTUDIANTE);
            estudiante.setStatus(StatusType.ACTIVO);
            userRepositoryPort.saveUser(estudiante);
            System.out.println("Default estudiante user created: estudiante@usco.edu.co / estudiante123");
        }
    }
}
