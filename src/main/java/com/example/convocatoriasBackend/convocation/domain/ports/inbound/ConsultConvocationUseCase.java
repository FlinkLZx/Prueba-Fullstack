package com.example.convocatoriasBackend.convocation.domain.ports.inbound;

import com.example.convocatoriasBackend.convocation.domain.model.Convocation;

import java.util.List;
import java.util.Optional;

public interface ConsultConvocationUseCase {

    List<Convocation> listAll();
    Optional<Convocation> findById(Long id);

}
