package com.anatoli.salonflow.controller;

import com.anatoli.salonflow.model.Promocion;
import com.anatoli.salonflow.repository.PromocionRepository;
import com.anatoli.salonflow.repository.ServicioRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/promociones")
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
    public Promocion crearPromocion(@RequestBody PromocionRequest request) {
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
    public Promocion actualizarPromocion(@PathVariable Long id, @RequestBody PromocionRequest request) {
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
    public void eliminarPromocion(@PathVariable Long id) {
        promocionRepository.deleteById(id);
    }
}