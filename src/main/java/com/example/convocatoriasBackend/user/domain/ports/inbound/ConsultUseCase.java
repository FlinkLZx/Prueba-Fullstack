package com.example.convocatoriasBackend.user.domain.ports.inbound;

import com.example.convocatoriasBackend.user.domain.model.User;

import java.util.List;

public interface ConsultUseCase {

    List<User> listAll();

}
