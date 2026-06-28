package com.anatoli.salonflow.controller;

import com.anatoli.salonflow.model.Usuario;
import com.anatoli.salonflow.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/usuarios")
@PreAuthorize("hasRole('ADMIN')")
public class UsuarioController{
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioController(UsuarioRepository usuarioRepository,PasswordEncoder passwordEncoder){
        this.usuarioRepository=usuarioRepository;
        this.passwordEncoder=passwordEncoder;
    }

    @GetMapping
    public List<Usuario> listarUsuarios(){
        return usuarioRepository.findAll();
    }

    @PostMapping
    public Usuario crearUsuario(@Valid @RequestBody UsuarioRequest request){
        Usuario usuario=new Usuario();
        usuario.setUsername(request.getUsername().trim());
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(request.getRol());
        return usuarioRepository.save(usuario);
    }

    @PutMapping("/{id}")
    public Usuario actualizarUsuario(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioUpdateRequest request){

        return usuarioRepository.findById(id).map(usuario->{

            usuario.setUsername(request.getUsername().trim());
            usuario.setRol(request.getRol());

            if(request.getPassword()!=null && !request.getPassword().isBlank()){
                usuario.setPassword(passwordEncoder.encode(request.getPassword()));
            }
            return usuarioRepository.save(usuario);

        }).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void eliminarUsuario(@PathVariable Long id){
        usuarioRepository.deleteById(id);
    }
}