package com.example.convocatoriasBackend.user.domain.model;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class User {

    private Long id;

    private String identification;

    private String name;
    private String email;
    private String password;

    private RoleType role;

    private StatusType status;

}
