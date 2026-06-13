package com.anatoli.salonflow.controller;

import com.anatoli.salonflow.model.Cita;
import com.anatoli.salonflow.repository.CitaRepository;
import com.anatoli.salonflow.repository.ClienteRepository;
import com.anatoli.salonflow.repository.EmpleadoRepository;
import com.anatoli.salonflow.repository.ServicioRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/citas")
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
    public Cita crearCita(@RequestBody CitaRequest request) {
        Cita cita = new Cita();

        cita.setFechaHora(request.getFechaHora());
        cita.setEstado(request.getEstado());

        cita.setCliente(clienteRepository.findById(request.getClienteId()).orElse(null));
        cita.setServicio(servicioRepository.findById(request.getServicioId()).orElse(null));
        cita.setEmpleado(empleadoRepository.findById(request.getEmpleadoId()).orElse(null));

        return citaRepository.save(cita);
    }


    @DeleteMapping("/{id}")
    public void eliminarCita(@PathVariable Long id) {
        citaRepository.deleteById(id);
    }

    @PutMapping("/{id}")
    public Cita actualizarCita(
            @PathVariable Long id,
            @RequestBody CitaRequest request) {

        return citaRepository.findById(id).map(cita -> {

            cita.setFechaHora(request.getFechaHora());

            cita.setEstado(request.getEstado());

            cita.setCliente(
                    clienteRepository
                            .findById(request.getClienteId())
                            .orElse(null)
            );

            cita.setServicio(
                    servicioRepository
                            .findById(request.getServicioId())
                            .orElse(null)
            );

            cita.setEmpleado(
                    empleadoRepository
                            .findById(request.getEmpleadoId())
                            .orElse(null)
            );

            return citaRepository.save(cita);

        }).orElse(null);

    }
}