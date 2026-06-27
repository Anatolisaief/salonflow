package com.anatoli.salonflow.controller;

import com.anatoli.salonflow.model.Promocion;
import com.anatoli.salonflow.repository.PromocionRepository;
import com.anatoli.salonflow.repository.ServicioRepository;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.security.access.prepost.PreAuthorize;
import java.util.List;

@RestController
@RequestMapping("/promociones")
@PreAuthorize("hasAnyRole('ADMIN','EMPLEADO')")
public class PromocionController {

    private final PromocionRepository promocionRepository;
    private final ServicioRepository servicioRepository;

    public PromocionController(
            PromocionRepository promocionRepository,
            ServicioRepository servicioRepository) {
        this.promocionRepository = promocionRepository;
        this.servicioRepository = servicioRepository;
    }

    @GetMapping
    public List<Promocion> listarPromociones() {
        return promocionRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Promocion crearPromocion(
            @Valid @RequestBody PromocionRequest request) {

        if (request.getFechaFin().isBefore(request.getFechaInicio())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La fecha de fin no puede ser anterior a la fecha de inicio."
            );
        }

        Promocion promocion = new Promocion();

        promocion.setNombre(request.getNombre());
        promocion.setDescripcion(request.getDescripcion());
        promocion.setFechaInicio(request.getFechaInicio());
        promocion.setFechaFin(request.getFechaFin());
        promocion.setDescuento(request.getDescuento());

        promocion.setServicios(
                servicioRepository.findAllById(request.getServiciosIds())
        );

        return promocionRepository.save(promocion);
    }

    @GetMapping("/{id}")
    public Promocion obtenerPromocionPorId(@PathVariable Long id) {
        return promocionRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Promocion actualizarPromocion(
            @PathVariable Long id,
            @Valid @RequestBody PromocionRequest request) {

        if (request.getFechaFin().isBefore(request.getFechaInicio())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La fecha de fin no puede ser anterior a la fecha de inicio."
            );
        }

        return promocionRepository.findById(id).map(promocion -> {

            promocion.setNombre(request.getNombre());
            promocion.setDescripcion(request.getDescripcion());
            promocion.setFechaInicio(request.getFechaInicio());
            promocion.setFechaFin(request.getFechaFin());
            promocion.setDescuento(request.getDescuento());

            promocion.setServicios(
                    servicioRepository.findAllById(request.getServiciosIds())
            );

            return promocionRepository.save(promocion);

        }).orElse(null);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminarPromocion(@PathVariable Long id) {
        promocionRepository.deleteById(id);
    }
}