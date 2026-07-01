package com.anatoli.salonflow.controller;

import java.time.LocalDateTime;
import com.anatoli.salonflow.model.EstadoCita;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;

public class CitaRequest {

    @NotNull(message = "La fecha y hora es obligatoria.")
    private LocalDateTime fechaHora;

    @NotNull(message = "El estado es obligatorio.")
    private EstadoCita estado;

    @NotNull(message = "El cliente es obligatorio.")
    private Long clienteId;

    @NotNull(message = "El servicio es obligatorio.")
    private Long servicioId;

    @NotNull(message = "El empleado es obligatorio.")
    private Long empleadoId;

    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public void setFechaHora(LocalDateTime fechaHora) {
        this.fechaHora = fechaHora;
    }

    public EstadoCita getEstado() {
        return estado;
    }

    public void setEstado(EstadoCita estado) {
        this.estado = estado;
    }

    public Long getClienteId() {
        return clienteId;
    }

    public void setClienteId(Long clienteId) {
        this.clienteId = clienteId;
    }

    public Long getServicioId() {
        return servicioId;
    }

    public void setServicioId(Long servicioId) {
        this.servicioId = servicioId;
    }

    public Long getEmpleadoId() {
        return empleadoId;
    }

    public void setEmpleadoId(Long empleadoId) {
        this.empleadoId = empleadoId;
    }
}