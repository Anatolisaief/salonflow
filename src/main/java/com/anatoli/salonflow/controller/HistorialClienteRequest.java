package com.anatoli.salonflow.controller;

import java.time.LocalDate;

public class HistorialClienteRequest{
    private LocalDate fecha;
    private Long servicioId;
    private String tecnica;
    private String colorAplicado;
    private String productosAplicados;
    private String observaciones;
    private String fotoAntes;
    private String fotoDespues;

    public LocalDate getFecha(){return fecha;}
    public void setFecha(LocalDate fecha){this.fecha=fecha;}

    public Long getServicioId(){return servicioId;}
    public void setServicioId(Long servicioId){this.servicioId=servicioId;}

    public String getTecnica(){return tecnica;}
    public void setTecnica(String tecnica){this.tecnica=tecnica;}

    public String getColorAplicado(){return colorAplicado;}
    public void setColorAplicado(String colorAplicado){this.colorAplicado=colorAplicado;}

    public String getProductosAplicados(){return productosAplicados;}
    public void setProductosAplicados(String productosAplicados){this.productosAplicados=productosAplicados;}

    public String getObservaciones(){return observaciones;}
    public void setObservaciones(String observaciones){this.observaciones=observaciones;}

    public String getFotoAntes(){return fotoAntes;}
    public void setFotoAntes(String fotoAntes){this.fotoAntes=fotoAntes;}

    public String getFotoDespues(){return fotoDespues;}
    public void setFotoDespues(String fotoDespues){this.fotoDespues=fotoDespues;}
}