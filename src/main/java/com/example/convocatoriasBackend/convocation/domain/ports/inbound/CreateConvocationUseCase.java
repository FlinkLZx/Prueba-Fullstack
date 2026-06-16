package com.example.convocatoriasBackend.convocation.domain.ports.inbound;

import com.example.convocatoriasBackend.convocation.domain.model.Convocation;

public interface CreateConvocationUseCase {

    Convocation createConvocation(Convocation convocation);

}
