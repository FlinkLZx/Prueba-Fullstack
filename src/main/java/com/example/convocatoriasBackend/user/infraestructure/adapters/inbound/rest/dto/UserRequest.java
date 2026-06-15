package com.example.convocatoriasBackend.user.infraestructure.adapters.inbound.rest.dto;

import com.example.convocatoriasBackend.user.domain.model.RoleType;
import com.example.convocatoriasBackend.user.domain.model.StatusType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UserRequest {

    @NotBlank(message = "You must provide a identification")
    private String identification;
    @NotBlank(message = "You must provide a name")
    private String name;
    @Email(message = "Invalid Email")
    @NotBlank(message = "You must provide an email")
    private String email;
    @NotBlank(message = "You must provide a password")
    private String password;
    @NotNull(message = "You must provide a role")
    private RoleType role;

    private StatusType status;

}
