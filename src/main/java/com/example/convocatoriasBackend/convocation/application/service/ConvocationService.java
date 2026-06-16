package com.example.convocatoriasBackend.convocation.application.service;

import com.example.convocatoriasBackend.convocation.domain.model.Convocation;
import com.example.convocatoriasBackend.convocation.domain.ports.inbound.ConsultConvocationUseCase;
import com.example.convocatoriasBackend.convocation.domain.ports.inbound.CreateConvocationUseCase;
import com.example.convocatoriasBackend.convocation.domain.ports.inbound.DeleteConvocationUseCase;
import com.example.convocatoriasBackend.convocation.domain.ports.inbound.UpdateConvocationUseCase;
import com.example.convocatoriasBackend.convocation.domain.ports.outbound.ConvocationRepositoryPort;

import java.util.List;
import java.util.Optional;

public class ConvocationService implements CreateConvocationUseCase, ConsultConvocationUseCase, UpdateConvocationUseCase, DeleteConvocationUseCase {

    private final ConvocationRepositoryPort repositoryPort;

    public ConvocationService(ConvocationRepositoryPort repositoryPort) {
        this.repositoryPort = repositoryPort;
    }

    @Override
    public Convocation createConvocation(Convocation convocation) {
        return repositoryPort.save(convocation);
    }

    @Override
    public List<Convocation> listAll() {
        return repositoryPort.findAll();
    }

    @Override
    public Optional<Convocation> findById(Long id) {
        return repositoryPort.findById(id);
    }

    @Override
    public Convocation updateConvocation(Long id, Convocation convocation) {
        return repositoryPort.update(id, convocation);
    }

    @Override
    public void deleteConvocation(Long id) {
        repositoryPort.delete(id);
    }
}
