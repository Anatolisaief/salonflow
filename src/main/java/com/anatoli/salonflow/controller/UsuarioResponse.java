package com.anatoli.salonflow.controller;

import com.anatoli.salonflow.model.Rol;

public class UsuarioResponse {

    private Long id;
    private String username;
    private Rol rol;
    private Long empleadoId;
    private String empleadoNombre;

    public UsuarioResponse() {
    }

    public UsuarioResponse(Long id, String username, Rol rol,
                           Long empleadoId, String empleadoNombre) {
        this.id = id;
        this.username = username;
        this.rol = rol;
        this.empleadoId = empleadoId;
        this.empleadoNombre = empleadoNombre;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }

    public Long getEmpleadoId() {
        return empleadoId;
    }

    public void setEmpleadoId(Long empleadoId) {
        this.empleadoId = empleadoId;
    }

    public String getEmpleadoNombre() {
        return empleadoNombre;
    }

    public void setEmpleadoNombre(String empleadoNombre) {
        this.empleadoNombre = empleadoNombre;
    }
}