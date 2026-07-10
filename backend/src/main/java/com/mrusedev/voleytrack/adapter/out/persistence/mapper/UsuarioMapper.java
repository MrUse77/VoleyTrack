package com.mrusedev.voleytrack.adapter.out.persistence.mapper;
import com.mrusedev.voleytrack.adapter.out.persistence.entity.UsuarioEntity;

import com.mrusedev.voleytrack.domain.Admin;
import com.mrusedev.voleytrack.domain.Planillero;
import com.mrusedev.voleytrack.domain.RolUsuario;
import com.mrusedev.voleytrack.domain.Usuario;

public class UsuarioMapper {

    public static UsuarioEntity toEntity(Usuario usuario) {
        UsuarioEntity entity = new UsuarioEntity();
        entity.setId(usuario.getId());
        entity.setNombre(usuario.getNombre());
        entity.setApellido(usuario.getApellido());
        entity.setEmail(usuario.getEmail());
        entity.setPassword(usuario.getPassword());
        entity.setDni(usuario.getDni());
        entity.setRol(usuario.getRol());
        if (usuario instanceof Planillero p) {
            entity.setTelefono(p.getTelefono());
        }
        return entity;
    }

    public static Usuario toDomain(UsuarioEntity entity) {
        if (entity.getRol() == RolUsuario.ADMIN) {
            return new Admin(entity.getId(), entity.getNombre(), entity.getApellido(),
                    entity.getEmail(), entity.getPassword(), entity.getDni());
        } else {
            return new Planillero(entity.getId(), entity.getNombre(), entity.getApellido(),
                    entity.getEmail(), entity.getPassword(), entity.getDni(), entity.getTelefono());
        }
    }
}
