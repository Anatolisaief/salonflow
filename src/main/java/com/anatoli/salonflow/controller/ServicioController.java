package com.anatoli.salonflow.controller;


import com.anatoli.salonflow.model.Servicio;
import com.anatoli.salonflow.repository.ServicioRepository;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/servicios")
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
    public Servicio crearServicio(@Valid @RequestBody Servicio servicio) {
        return servicioRepository.save(servicio);
    }

    @GetMapping("/{id}")
    public Servicio obtenerServicioPorId(@PathVariable Long id) {
        return servicioRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Servicio actualizarServicio(@PathVariable Long id, @Valid @RequestBody Servicio servicioActualizado) {
        return servicioRepository.findById(id).map(servicio -> {
            servicio.setNombre(servicioActualizado.getNombre());
            servicio.setPrecio(servicioActualizado.getPrecio());
            servicio.setDuracion(servicioActualizado.getDuracion());
            return servicioRepository.save(servicio);
        }).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void eliminarServicio(@PathVariable Long id) {
        servicioRepository.deleteById(id);
    }
}
