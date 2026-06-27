package com.anatoli.salonflow.controller;


import com.anatoli.salonflow.model.Servicio;
import com.anatoli.salonflow.repository.ServicioRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/servicios")
@PreAuthorize("hasAnyRole('ADMIN','EMPLEADO')")
public class ServicioController {

    private final ServicioRepository servicioRepository;

    public ServicioController(ServicioRepository servicioRepository) {
        this.servicioRepository = servicioRepository;
    }

    @GetMapping
    public List<Servicio> listarServicios() {
        return servicioRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Servicio crearServicio(@Valid @RequestBody Servicio servicio) {
        return servicioRepository.save(servicio);
    }

    @GetMapping("/{id}")
    public Servicio obtenerServicioPorId(@PathVariable Long id) {
        return servicioRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Servicio actualizarServicio(@PathVariable Long id, @Valid @RequestBody Servicio servicioActualizado) {
        return servicioRepository.findById(id).map(servicio -> {
            servicio.setNombre(servicioActualizado.getNombre());
            servicio.setPrecio(servicioActualizado.getPrecio());
            servicio.setDuracion(servicioActualizado.getDuracion());
            return servicioRepository.save(servicio);
        }).orElse(null);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminarServicio(@PathVariable Long id) {
        servicioRepository.deleteById(id);
    }
}
