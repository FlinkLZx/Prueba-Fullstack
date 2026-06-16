package com.example.convocatoriasBackend.convocation.domain.ports.inbound;

import com.example.convocatoriasBackend.convocation.domain.model.Convocation;

public interface UpdateConvocationUseCase {

    Convocation updateConvocation(Long id, Convocation convocation);

}
