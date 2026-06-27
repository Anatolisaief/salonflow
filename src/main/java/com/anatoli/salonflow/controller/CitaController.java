package com.anatoli.salonflow.controller;

import com.anatoli.salonflow.model.Cita;
import com.anatoli.salonflow.repository.CitaRepository;
import com.anatoli.salonflow.repository.ClienteRepository;
import com.anatoli.salonflow.repository.EmpleadoRepository;
import com.anatoli.salonflow.repository.ServicioRepository;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import com.anatoli.salonflow.model.Cliente;
import com.anatoli.salonflow.model.Servicio;
import com.anatoli.salonflow.model.Empleado;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;

@RestController
@RequestMapping("/citas")
@PreAuthorize("hasAnyRole('ADMIN','EMPLEADO')")
public class CitaController {

    private final CitaRepository citaRepository;
    private final ClienteRepository clienteRepository;
    private final ServicioRepository servicioRepository;
    private final EmpleadoRepository empleadoRepository;

    public CitaController(
            CitaRepository citaRepository,
            ClienteRepository clienteRepository,
            ServicioRepository servicioRepository,
            EmpleadoRepository empleadoRepository) {
        this.citaRepository = citaRepository;
        this.clienteRepository = clienteRepository;
        this.servicioRepository = servicioRepository;
        this.empleadoRepository = empleadoRepository;
    }

    @GetMapping
    public List<Cita> listarCitas() {
        return citaRepository.findAll();
    }

    @GetMapping("/{id}")
    public Cita obtenerCitaPorId(@PathVariable Long id) {
        return citaRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Cita crearCita(@Valid @RequestBody CitaRequest request) {

        Cliente cliente = clienteRepository.findById(request.getClienteId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "El cliente no existe."
                ));

        Servicio servicio = servicioRepository.findById(request.getServicioId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "El servicio no existe."
                ));

        Empleado empleado = empleadoRepository.findById(request.getEmpleadoId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "El empleado no existe."
                ));

        if (citaRepository.existsByEmpleadoIdAndFechaHora(
                request.getEmpleadoId(),
                request.getFechaHora())) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El empleado ya tiene una cita en esa fecha y hora."
            );
        }

        Cita cita = new Cita();
        cita.setFechaHora(request.getFechaHora());
        cita.setEstado(request.getEstado());
        cita.setCliente(cliente);
        cita.setServicio(servicio);
        cita.setEmpleado(empleado);

        return citaRepository.save(cita);
    }


    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminarCita(@PathVariable Long id) {
        citaRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    public Cita actualizarCita(
            @PathVariable Long id,
            @Valid @RequestBody CitaRequest request) {

        Cliente cliente = clienteRepository.findById(request.getClienteId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "El cliente no existe."
                ));

        Servicio servicio = servicioRepository.findById(request.getServicioId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "El servicio no existe."
                ));

        Empleado empleado = empleadoRepository.findById(request.getEmpleadoId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "El empleado no existe."
                ));
        if (citaRepository.existsByEmpleadoIdAndFechaHoraAndIdNot(
                request.getEmpleadoId(),
                request.getFechaHora(),
                id)) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El empleado ya tiene otra cita en esa fecha y hora."
            );
        }

        return citaRepository.findById(id).map(cita -> {
            cita.setFechaHora(request.getFechaHora());
            cita.setEstado(request.getEstado());
            cita.setCliente(cliente);
            cita.setServicio(servicio);
            cita.setEmpleado(empleado);
            return citaRepository.save(cita);
        }).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "La cita no existe."
        ));
    }
}