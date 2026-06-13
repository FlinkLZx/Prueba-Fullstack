package com.example.convocatoriasBackend.user.domain.ports.inbound;

import com.example.convocatoriasBackend.user.domain.model.User;

public interface CreateUseCase {

    User createUser(User user) throws IllegalAccessException;

}
