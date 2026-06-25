package com.anatoli.salonflow.repository;

import com.anatoli.salonflow.model.HistorialCliente;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HistorialClienteRepository extends JpaRepository<HistorialCliente,Long>{
    List<HistorialCliente> findByClienteIdOrderByFechaDesc(Long clienteId);
}