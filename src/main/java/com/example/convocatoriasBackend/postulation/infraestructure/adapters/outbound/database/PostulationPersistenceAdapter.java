package com.example.convocatoriasBackend.postulation.infraestructure.adapters.outbound.database;

import com.example.convocatoriasBackend.convocation.infraestructure.adapters.outbound.database.ConvocationEntity;
import com.example.convocatoriasBackend.postulation.domain.model.Postulation;
import com.example.convocatoriasBackend.postulation.domain.ports.outbound.PostulationRepositoryPort;
import com.example.convocatoriasBackend.user.infraestructure.adapters.outbound.database.UserEntity;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class PostulationPersistenceAdapter implements PostulationRepositoryPort {

    private final SpringDataPostulationRepository repository;

    public PostulationPersistenceAdapter(SpringDataPostulationRepository repository) {
        this.repository = repository;
    }


    @Override
    public Postulation save(Postulation postulation) {
        return null;
    }

    @Override
    public List<Postulation> findAll() {
        return List.of();
    }

    @Override
    public Optional<Postulation> findById(Long id) {
        return Optional.empty();
    }

    @Override
    public Optional<Postulation> findByStudentIdAndConvocationId(Long studentId, Long convocationId) {
        return Optional.empty();
    }

    @Override
    public long countByConvocationId(Long convocatoriaId) {
        return 0;
    }

    private PostulationEntity toEntity(Postulation domain) {
        if (domain == null) return null;

        PostulationEntity entity = new PostulationEntity();
        entity.setId(domain.getId());
        entity.setPostulationDate(domain.getPostulationDate());
        entity.setStatus(domain.getStatus());

        if (domain.getConvocation() != null) {
            ConvocationEntity conv = new ConvocationEntity();
            conv.setId(domain.getConvocation().getId());
            entity.setConvocation(conv);
        }

        if (domain.getStudent() != null) {
            UserEntity user = new UserEntity();
            user.setId(domain.getStudent().getId());
            entity.setStudent(user);
        }

        return entity;
    }

    private Postulation toDomain(PostulationEntity entity) {
        if (entity == null) return null;

        Postulation domain = new Postulation();
        domain.setId(entity.getId());
        domain.setPostulationDate(entity.getPostulationDate());
        domain.setStatus(entity.getStatus());

        if (entity.getConvocation() != null) {
            com.example.convocatoriasBackend.convocation.domain.model.Convocation conv = new com.example.convocatoriasBackend.convocation.domain.model.Convocation();
            conv.setId(entity.getConvocation().getId());
            conv.setName(entity.getConvocation().getName());
            conv.setSpotsAvailable(entity.getConvocation().getSpotsAvailable());
            conv.setStatus(entity.getConvocation().getStatus());
            domain.setConvocation(conv);
        }

        if (entity.getStudent() != null) {
            com.example.convocatoriasBackend.user.domain.model.User user = new com.example.convocatoriasBackend.user.domain.model.User();
            user.setId(entity.getStudent().getId());
            user.setName(entity.getStudent().getName());
            user.setEmail(entity.getStudent().getEmail());
            domain.setStudent(user);
        }

        return domain;
    }

}
