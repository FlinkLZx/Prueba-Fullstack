package com.example.convocatoriasBackend.user.infraestructure.adapters.outbound.database;

import com.example.convocatoriasBackend.user.domain.model.RoleType;
import com.example.convocatoriasBackend.user.domain.model.StatusType;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String identification;

    @Column(nullable = false, length = 100)
    private String name;
    @Column(nullable = false, length = 100)
    private String email;
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private RoleType role;

    @Enumerated(EnumType.STRING)
    private StatusType status;

}
