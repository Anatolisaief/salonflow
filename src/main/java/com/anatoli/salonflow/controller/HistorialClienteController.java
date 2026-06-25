package com.anatoli.salonflow.controller;

import com.anatoli.salonflow.model.HistorialCliente;
import com.anatoli.salonflow.repository.ClienteRepository;
import com.anatoli.salonflow.repository.HistorialClienteRepository;
import com.anatoli.salonflow.repository.ServicioRepository;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/clientes/{clienteId}/historial")
public class HistorialClienteController{
    private final HistorialClienteRepository historialRepository;
    private final ClienteRepository clienteRepository;
    private final ServicioRepository servicioRepository;

    public HistorialClienteController(HistorialClienteRepository historialRepository,ClienteRepository clienteRepository,ServicioRepository servicioRepository){
        this.historialRepository=historialRepository;
        this.clienteRepository=clienteRepository;
        this.servicioRepository=servicioRepository;
    }

    @GetMapping
    public List<HistorialCliente> listarHistorial(@PathVariable Long clienteId){
        return historialRepository.findByClienteIdOrderByFechaDesc(clienteId);
    }

    @GetMapping("/{historialId}")
    public HistorialCliente obtenerHistorialPorId(@PathVariable Long historialId){
        return historialRepository.findById(historialId).orElse(null);
    }

    @PostMapping
    public HistorialCliente crearHistorial(@PathVariable Long clienteId,@Valid @RequestBody HistorialClienteRequest request){
        HistorialCliente historial=new HistorialCliente();

        historial.setFecha(request.getFecha());
        historial.setTecnica(request.getTecnica());
        historial.setColorAplicado(request.getColorAplicado());
        historial.setProductosAplicados(request.getProductosAplicados());
        historial.setObservaciones(request.getObservaciones());
        historial.setFotoAntes(request.getFotoAntes());
        historial.setFotoDespues(request.getFotoDespues());

        historial.setCliente(clienteRepository.findById(clienteId).orElse(null));

        if(request.getServicioId()!=null){
            historial.setServicio(servicioRepository.findById(request.getServicioId()).orElse(null));
        }

        return historialRepository.save(historial);
    }

    @PutMapping("/{historialId}")
    public HistorialCliente actualizarHistorial(
            @PathVariable Long historialId,
            @Valid @RequestBody HistorialClienteRequest request){

        return historialRepository.findById(historialId).map(historial->{

            historial.setFecha(request.getFecha());
            historial.setTecnica(request.getTecnica());
            historial.setColorAplicado(request.getColorAplicado());
            historial.setProductosAplicados(request.getProductosAplicados());
            historial.setObservaciones(request.getObservaciones());
            historial.setFotoAntes(request.getFotoAntes());
            historial.setFotoDespues(request.getFotoDespues());

            if(request.getServicioId()!=null){
                historial.setServicio(
                        servicioRepository.findById(request.getServicioId()).orElse(null)
                );
            }else{
                historial.setServicio(null);
            }

            return historialRepository.save(historial);

        }).orElse(null);
    }

    @DeleteMapping("/{historialId}")
    public void eliminarHistorial(@PathVariable Long historialId){
        historialRepository.deleteById(historialId);
    }
}