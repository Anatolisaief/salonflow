package com.anatoli.salonflow.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;


    @Entity
    @Table(name = "servicios")
    public class Servicio {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        @NotBlank(message = "El nombre es obligatorio.")
        @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres.")
        @Pattern(
                regexp = "^[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\\s'.-]+$",
                message = "El nombre contiene caracteres no válidos."
        )
        private String nombre;

        @NotNull(message = "El precio es obligatorio.")
        @DecimalMin(
                value = "0.01",
                message = "El precio debe ser mayor que 0."
        )
        @DecimalMax(
                value = "9999.00",
                message = "El precio no puede superar 9999 €."
        )
        private Double precio;

        @NotNull(message = "La duración es obligatoria.")
        @Min(
                value = 1,
                message = "La duración debe ser mayor que 0."
        )
        @Max(
                value = 480,
                message = "La duración no puede superar 480 minutos."
        )
        private Integer duracion;

        public Servicio() {
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public String getNombre() {
            return nombre;
        }

        public void setNombre(String nombre) {
            this.nombre = nombre;
        }

        public Double getPrecio() {
            return precio;
        }

        public void setPrecio(Double precio) {
            this.precio = precio;
        }

        public Integer getDuracion() {
            return duracion;
        }

        public void setDuracion(Integer duracion) {
            this.duracion = duracion;
        }
    }

