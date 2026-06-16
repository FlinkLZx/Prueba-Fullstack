package com.example.convocatoriasBackend.convocation.domain.ports.outbound;

import com.example.convocatoriasBackend.convocation.domain.model.Convocation;

import java.util.List;
import java.util.Optional;

public interface ConvocationRepositoryPort {

    Convocation save(Convocation convocation);
    List<Convocation> findAll();
    Optional<Convocation> findById(Long id);
    Convocation update(Long id, Convocation convocation);
    void delete(Long id);

}
