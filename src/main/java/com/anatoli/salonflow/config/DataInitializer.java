package com.anatoli.salonflow.config;

import com.anatoli.salonflow.model.Rol;
import com.anatoli.salonflow.model.Usuario;
import com.anatoli.salonflow.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner{

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder){
        this.usuarioRepository=usuarioRepository;
        this.passwordEncoder=passwordEncoder;
    }

    @Override
    public void run(String... args){
        if(usuarioRepository.findByUsername("admin").isEmpty()){
            Usuario admin=new Usuario();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRol(Rol.ADMIN);
            usuarioRepository.save(admin);
        }

        if(usuarioRepository.findByUsername("empleado").isEmpty()){
            Usuario empleado=new Usuario();
            empleado.setUsername("empleado");
            empleado.setPassword(passwordEncoder.encode("empleado123"));
            empleado.setRol(Rol.EMPLEADO);
            usuarioRepository.save(empleado);
        }
    }
}