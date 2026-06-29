package com.anatoli.salonflow.repository;

import com.anatoli.salonflow.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario,Long> {
    Optional<Usuario> findByUsername(String username);
    boolean existsByUsername(String username);
    boolean existsByUsernameAndIdNot(String username, Long id);
    boolean existsByEmpleadoId(Long empleadoId);
    boolean existsByEmpleadoIdAndIdNot(Long empleadoId, Long id);
}