package com.example.convocatoriasBackend.postulation.application.service;

import com.example.convocatoriasBackend.convocation.domain.model.Convocation;
import com.example.convocatoriasBackend.convocation.domain.model.ConvocationStatus;
import com.example.convocatoriasBackend.convocation.domain.ports.outbound.ConvocationRepositoryPort;
import com.example.convocatoriasBackend.postulation.domain.model.Postulation;
import com.example.convocatoriasBackend.postulation.domain.model.PostulationStatus;
import com.example.convocatoriasBackend.postulation.domain.ports.inbound.ConsultPostulationUseCase;
import com.example.convocatoriasBackend.postulation.domain.ports.inbound.CreatePostulationUseCase;
import com.example.convocatoriasBackend.postulation.domain.ports.inbound.UpdatePostulationStatusUseCase;
import com.example.convocatoriasBackend.postulation.domain.ports.outbound.PostulationRepositoryPort;
import com.example.convocatoriasBackend.user.domain.model.User;
import com.example.convocatoriasBackend.user.domain.ports.outbound.UserRepositoryPort;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public class PostulationService implements CreatePostulationUseCase, ConsultPostulationUseCase, UpdatePostulationStatusUseCase {

    private final PostulationRepositoryPort postulationRepositoryPort;
    private final ConvocationRepositoryPort convocationRepositoryPort;
    private final UserRepositoryPort userRepositoryPort;

    public PostulationService(PostulationRepositoryPort postulationRepositoryPort,
                              ConvocationRepositoryPort convocationRepositoryPort,
                              UserRepositoryPort userRepositoryPort) {
        this.postulationRepositoryPort = postulationRepositoryPort;
        this.convocationRepositoryPort = convocationRepositoryPort;
        this.userRepositoryPort = userRepositoryPort;
    }

    @Override
    public Postulation createPostulation(Postulation postulation) throws IllegalAccessException {

        User student = userRepositoryPort.findById(postulation.getStudent().getId())
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        Convocation convocation = convocationRepositoryPort.findById(postulation.getConvocation().getId())
                .orElseThrow(() -> new IllegalArgumentException("Convocation not found"));

        if (postulationRepositoryPort.findByStudentIdAndConvocationId(student.getId(), convocation.getId()).isPresent()) {
            throw new IllegalArgumentException("You have already applied to this convocation");
        }

        if (convocation.getStatus() == ConvocationStatus.CERRADA || convocation.getStatus() == ConvocationStatus.BORRADOR) {
            throw new IllegalArgumentException("Cannot apply to a convocation that is closed or in draft status");
        }

        if (convocation.getSpotsAvailable() <= 0) {
            throw new IllegalArgumentException("No spots available for this convocation");
        }

        postulation.setStudent(student);
        postulation.setConvocation(convocation);
        postulation.setPostulationDate(LocalDateTime.now());
        postulation.setStatus(PostulationStatus.PENDIENTE);

        return postulationRepositoryPort.save(postulation);
    }

    @Override
    public List<Postulation> listAll() {
        return postulationRepositoryPort.findAll();
    }

    @Override
    public Optional<Postulation> findById(Long id) {
        return postulationRepositoryPort.findById(id);
    }

    @Override
    public Postulation updateStatus(Long id, PostulationStatus newStatus) {
        Postulation existing = postulationRepositoryPort.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Postulation not found with id " + id));

        PostulationStatus currentStatus = existing.getStatus();

        if (currentStatus == newStatus) {
            return existing;
        }

        Convocation convocation = existing.getConvocation();

        if (newStatus == PostulationStatus.APROBADA && currentStatus != PostulationStatus.APROBADA) {
            if (convocation.getSpotsAvailable() <= 0) {
                throw new IllegalArgumentException("No spots available to approve this application");
            }
            convocation.setSpotsAvailable(convocation.getSpotsAvailable() - 1);
            convocationRepositoryPort.update(convocation.getId(), convocation);
        }

        else if (newStatus != PostulationStatus.APROBADA && currentStatus == PostulationStatus.APROBADA) {
            convocation.setSpotsAvailable(convocation.getSpotsAvailable() + 1);
            convocationRepositoryPort.update(convocation.getId(), convocation);
        }

        existing.setStatus(newStatus);
        return postulationRepositoryPort.save(existing);
    }
}
