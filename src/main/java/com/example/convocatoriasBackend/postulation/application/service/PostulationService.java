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

    private final PostulationRepositoryPort repositoryPort;
    private final ConvocationRepositoryPort convocatoriaRepositoryPort;
    private final UserRepositoryPort userRepositoryPort;

    public PostulationService(PostulationRepositoryPort repositoryPort,
                              ConvocationRepositoryPort convocatoriaRepositoryPort,
                              UserRepositoryPort userRepositoryPort) {
        this.repositoryPort = repositoryPort;
        this.convocatoriaRepositoryPort = convocatoriaRepositoryPort;
        this.userRepositoryPort = userRepositoryPort;
    }

    @Override
    public Postulation createPostulation(Postulation postulation) throws IllegalAccessException {
        // Validate user exists
        User student = userRepositoryPort.findById(postulation.getStudent().getId())
                .orElseThrow(() -> new IllegalArgumentException("Student not found"));

        // Validate convocatoria exists
        Convocation convocation = convocatoriaRepositoryPort.findById(postulation.getConvocation().getId())
                .orElseThrow(() -> new IllegalArgumentException("Convocation not found"));

        if (repositoryPort.findByStudentIdAndConvocationId(student.getId(), convocation.getId()).isPresent()) {
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

        return repositoryPort.save(postulation);
    }

    @Override
    public List<Postulation> listAll() {
        return repositoryPort.findAll();
    }

    @Override
    public Optional<Postulation> findById(Long id) {
        return repositoryPort.findById(id);
    }

    @Override
    public Postulation updateStatus(Long id, PostulationStatus newStatus) {
        Postulation existing = repositoryPort.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Postulation not found with id " + id));

        PostulationStatus currentStatus = existing.getStatus();

        if (currentStatus == newStatus) {
            return existing;
        }

        Convocation convocation = existing.getConvocation();

        // If changing status to APROBADA
        if (newStatus == PostulationStatus.APROBADA && currentStatus != PostulationStatus.APROBADA) {
            if (convocation.getSpotsAvailable() <= 0) {
                throw new IllegalArgumentException("No spots available to approve this application");
            }
            convocation.setSpotsAvailable(convocation.getSpotsAvailable() - 1);
            convocatoriaRepositoryPort.update(convocation.getId(), convocation);
        }
        // If changing status from APROBADA to something else
        else if (newStatus != PostulationStatus.APROBADA && currentStatus == PostulationStatus.APROBADA) {
            convocation.setSpotsAvailable(convocation.getSpotsAvailable() + 1);
            convocatoriaRepositoryPort.update(convocation.getId(), convocation);
        }

        existing.setStatus(newStatus);
        return repositoryPort.save(existing);
    }
}
