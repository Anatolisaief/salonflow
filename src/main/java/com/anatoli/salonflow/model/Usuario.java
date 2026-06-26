package com.anatoli.salonflow.model;

import jakarta.persistence.*;

@Entity
@Table(name="usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    private String username;

    private String password;

    @Enumerated(EnumType.STRING)
    private Rol rol;

    public Usuario(){}

    public Long getId(){return id;}

    public String getUsername(){return username;}
    public void setUsername(String username){this.username=username;}

    public String getPassword(){return password;}
    public void setPassword(String password){this.password=password;}

    public Rol getRol(){return rol;}
    public void setRol(Rol rol){this.rol=rol;}
}