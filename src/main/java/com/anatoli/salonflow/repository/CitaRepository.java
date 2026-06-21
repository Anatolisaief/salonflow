package com.anatoli.salonflow.repository;

import com.anatoli.salonflow.model.Cita;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;

@Repository
public interface CitaRepository extends JpaRepository<Cita, Long> {
    boolean existsByEmpleadoIdAndFechaHora(Long empleadoId, LocalDateTime fechaHora);
    boolean existsByEmpleadoIdAndFechaHoraAndIdNot(
            Long empleadoId,
            LocalDateTime fechaHora,
            Long id
    );
}