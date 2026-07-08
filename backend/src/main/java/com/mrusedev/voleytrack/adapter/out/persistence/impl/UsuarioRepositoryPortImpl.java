package com.mrusedev.voleytrack.adapter.out.persistence.impl;
import com.mrusedev.voleytrack.adapter.out.persistence.repository.UsuarioSpringDataRepository;
import com.mrusedev.voleytrack.adapter.out.persistence.entity.UsuarioEntity;
import com.mrusedev.voleytrack.adapter.out.persistence.mapper.UsuarioMapper;

import com.mrusedev.voleytrack.application.port.out.UsuarioRepositoryPort;
import com.mrusedev.voleytrack.domain.Usuario;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.StreamSupport;

@Repository
public class UsuarioRepositoryPortImpl implements UsuarioRepositoryPort {

    private final UsuarioSpringDataRepository repo;

    public UsuarioRepositoryPortImpl(UsuarioSpringDataRepository repo) {
        this.repo = repo;
    }

    @Override
    public Usuario guardar(Usuario usuario) {
        UsuarioEntity entity = UsuarioMapper.toEntity(usuario);
        UsuarioEntity saved = repo.save(entity);
        return UsuarioMapper.toDomain(saved);
    }

    @Override
    public Optional<Usuario> buscarPorId(Long id) {
        return repo.findById(id).map(UsuarioMapper::toDomain);
    }

    @Override
    public Optional<Usuario> buscarPorEmail(String email) {
        return repo.findByEmail(email).map(UsuarioMapper::toDomain);
    }

    @Override
    public List<Usuario> buscarTodos() {
        return StreamSupport.stream(repo.findAll().spliterator(), false)
                .map(UsuarioMapper::toDomain)
                .toList();
    }
}
