package com.anatoli.salonflow.controller;

import com.anatoli.salonflow.model.Usuario;
import com.anatoli.salonflow.repository.UsuarioRepository;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController{

    private final UsuarioRepository usuarioRepository;

    public AuthController(UsuarioRepository usuarioRepository){
        this.usuarioRepository=usuarioRepository;
    }

    @GetMapping("/me")
    public Map<String,String> obtenerUsuarioActual(Authentication authentication){

        Usuario usuario=usuarioRepository.findByUsername(authentication.getName())
                .orElseThrow();

        String rol=authentication.getAuthorities()
                .iterator()
                .next()
                .getAuthority()
                .replace("ROLE_","");

        String nombreMostrado=usuario.getEmpleado()!=null
                ? usuario.getEmpleado().getNombre()
                : usuario.getUsername();

        return Map.of(
                "username",usuario.getUsername(),
                "rol",rol,
                "nombreMostrado",nombreMostrado,
                "empleadoNombre",usuario.getEmpleado()!=null ? usuario.getEmpleado().getNombre() : ""
        );
    }
}