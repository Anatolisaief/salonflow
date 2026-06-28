package com.anatoli.salonflow.controller;

import com.anatoli.salonflow.model.Rol;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class UsuarioUpdateRequest {

    @NotBlank(message="El usuario es obligatorio.")
    @Size(min=3,max=50,message="El usuario debe tener entre 3 y 50 caracteres.")
    private String username;

    @Size(max=100,message="La contraseña no puede superar los 100 caracteres.")
    private String password;

    @NotNull(message="El rol es obligatorio.")
    private Rol rol;

    public String getUsername(){return username;}
    public void setUsername(String username){this.username=username;}

    public String getPassword(){return password;}
    public void setPassword(String password){this.password=password;}

    public Rol getRol(){return rol;}
    public void setRol(Rol rol){this.rol=rol;}
}