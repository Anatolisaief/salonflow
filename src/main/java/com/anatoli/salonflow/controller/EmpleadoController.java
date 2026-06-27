package com.anatoli.salonflow.controller;

import com.anatoli.salonflow.model.Empleado;
import com.anatoli.salonflow.repository.EmpleadoRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/empleados")
@PreAuthorize("hasAnyRole('ADMIN','EMPLEADO')")
public class EmpleadoController {

    private final EmpleadoRepository empleadoRepository;

    public EmpleadoController(EmpleadoRepository empleadoRepository) {
        this.empleadoRepository = empleadoRepository;
    }

    @GetMapping
    public List<Empleado> listarEmpleados() {
        return empleadoRepository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Empleado crearEmpleado(@Valid @RequestBody Empleado empleado) {
        return empleadoRepository.save(empleado);
    }

    @GetMapping("/{id}")
    public Empleado obtenerEmpleadoPorId(@PathVariable Long id) {
        return empleadoRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Empleado actualizarEmpleado(
            @PathVariable Long id,
            @Valid @RequestBody Empleado empleadoActualizado) {

        return empleadoRepository.findById(id).map(empleado -> {
            empleado.setNombre(empleadoActualizado.getNombre());
            empleado.setCargo(empleadoActualizado.getCargo());
            empleado.setHoraInicio(empleadoActualizado.getHoraInicio());
            empleado.setHoraFin(empleadoActualizado.getHoraFin());
            return empleadoRepository.save(empleado);
        }).orElse(null);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void eliminarEmpleado(@PathVariable Long id) {
        empleadoRepository.deleteById(id);
    }
}