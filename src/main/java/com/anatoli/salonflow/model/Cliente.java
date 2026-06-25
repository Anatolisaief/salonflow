package com.anatoli.salonflow.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

@Entity
@Table(name = "clientes")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @NotBlank(message = "El nombre es obligatorio.")
    @Size(min = 2, max = 50, message = "El nombre debe tener entre 2 y 50 caracteres.")
    @Pattern(
            regexp = "^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\\s'-]+$",
            message = "El nombre solo puede contener letras y espacios."
    )
    private String nombre;


    @NotBlank(message = "El teléfono es obligatorio.")
    @Pattern(
            regexp = "\\d{9}",
            message = "El teléfono debe tener exactamente 9 dígitos."
    )
    private String telefono;


    @NotBlank(message = "El email es obligatorio.")
    @Email(message = "El email no es válido.")
    @Size(max = 100, message = "El email no puede superar los 100 caracteres.")
    private String email;

    private LocalDate fechaNacimiento;

    @Size(max=255,message="Las alergias no pueden superar los 255 caracteres.")
    private String alergias;

    @Size(max=500,message="Las observaciones no pueden superar los 500 caracteres.")
    private String observaciones;

    public Cliente() {
    }

    public Long getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public LocalDate getFechaNacimiento(){
        return fechaNacimiento;
    }

    public void setFechaNacimiento(LocalDate fechaNacimiento){
        this.fechaNacimiento=fechaNacimiento;
    }

    public String getAlergias(){
        return alergias;
    }

    public void setAlergias(String alergias){
        this.alergias=alergias;
    }

    public String getObservaciones(){
        return observaciones;
    }

    public void setObservaciones(String observaciones){
        this.observaciones=observaciones;
    }
}