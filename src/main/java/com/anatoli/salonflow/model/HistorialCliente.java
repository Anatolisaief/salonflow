package com.anatoli.salonflow.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

@Entity
@Table(name="historial_clientes")
public class HistorialCliente{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    private LocalDate fecha;

    @ManyToOne
    @JoinColumn(name="servicio_id")
    private Servicio servicio;

    @Size(max=100)
    private String tecnica;

    @Size(max=150)
    private String colorAplicado;

    @Size(max=255)
    private String productosAplicados;

    @Size(max=500)
    private String observaciones;

    private String fotoAntes;
    private String fotoDespues;

    @ManyToOne
    @JoinColumn(name="cliente_id",nullable=false)
    private Cliente cliente;

    public HistorialCliente(){}

    public Long getId(){return id;}
    public LocalDate getFecha(){return fecha;}
    public void setFecha(LocalDate fecha){this.fecha=fecha;}

    public Servicio getServicio() {
        return servicio;
    }

    public void setServicio(Servicio servicio) {
        this.servicio = servicio;
    }

    public String getTecnica(){return tecnica;}
    public void setTecnica(String tecnica){this.tecnica=tecnica;}
    public String getColorAplicado(){return colorAplicado;}
    public void setColorAplicado(String colorAplicado){this.colorAplicado=colorAplicado;}

    public String getProductosAplicados() {
        return productosAplicados;
    }

    public void setProductosAplicados(String productosAplicados) {
        this.productosAplicados = productosAplicados;
    }

    public String getObservaciones(){return observaciones;}
    public void setObservaciones(String observaciones){this.observaciones=observaciones;}
    public String getFotoAntes(){return fotoAntes;}
    public void setFotoAntes(String fotoAntes){this.fotoAntes=fotoAntes;}
    public String getFotoDespues(){return fotoDespues;}
    public void setFotoDespues(String fotoDespues){this.fotoDespues=fotoDespues;}
    public Cliente getCliente(){return cliente;}
    public void setCliente(Cliente cliente){this.cliente=cliente;}
}