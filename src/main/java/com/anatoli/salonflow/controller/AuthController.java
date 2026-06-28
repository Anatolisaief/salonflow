package com.anatoli.salonflow.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController{

    @GetMapping("/me")
    public Map<String,String> obtenerUsuarioActual(Authentication authentication){
        String rol=authentication.getAuthorities()
                .iterator()
                .next()
                .getAuthority()
                .replace("ROLE_","");

        return Map.of(
                "username",authentication.getName(),
                "rol",rol
        );
    }
}