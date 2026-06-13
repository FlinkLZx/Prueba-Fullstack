package com.example.convocatoriasBackend.user.domain.ports.inbound;

import com.example.convocatoriasBackend.user.domain.model.User;

public interface UpdateUseCase {

    User updateUser(long id, User user);

}
