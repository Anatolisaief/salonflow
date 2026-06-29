package com.anatoli.salonflow.controller;

import com.anatoli.salonflow.model.Empleado;
import com.anatoli.salonflow.model.Usuario;
import com.anatoli.salonflow.repository.EmpleadoRepository;
import com.anatoli.salonflow.repository.UsuarioRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/usuarios")
@PreAuthorize("hasRole('ADMIN')")
public class UsuarioController{

    private final UsuarioRepository usuarioRepository;
    private final EmpleadoRepository empleadoRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioController(
            UsuarioRepository usuarioRepository,
            EmpleadoRepository empleadoRepository,
            PasswordEncoder passwordEncoder){
        this.usuarioRepository=usuarioRepository;
        this.empleadoRepository=empleadoRepository;
        this.passwordEncoder=passwordEncoder;
    }

    @GetMapping
    public List<UsuarioResponse> listarUsuarios(){

        return usuarioRepository.findAll()
                .stream()
                .map(this::convertirAResponse)
                .toList();
    }

    @PostMapping
    public Usuario crearUsuario(@Valid @RequestBody UsuarioRequest request){
        String username=request.getUsername().trim();

        if(usuarioRepository.existsByUsername(username)){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ya existe un usuario con ese nombre."
            );
        }

        Empleado empleado = request.getEmpleadoId() == null
                ? null
                : empleadoRepository.findById(request.getEmpleadoId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "El empleado no existe."
                ));

        if(empleado!=null && usuarioRepository.existsByEmpleadoId(empleado.getId())){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Este empleado ya tiene un usuario asociado."
            );
        }

        Usuario usuario=new Usuario();
        usuario.setUsername(username);
        usuario.setPassword(passwordEncoder.encode(request.getPassword()));
        usuario.setRol(request.getRol());
        usuario.setEmpleado(empleado);

        return usuarioRepository.save(usuario);
    }

    @PutMapping("/{id}")
    public Usuario actualizarUsuario(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioUpdateRequest request){

        String username=request.getUsername().trim();

        if(usuarioRepository.existsByUsernameAndIdNot(username,id)){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Ya existe un usuario con ese nombre."
            );
        }

        Empleado empleado = request.getEmpleadoId() == null
                ? null
                : empleadoRepository.findById(request.getEmpleadoId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "El empleado no existe."
                ));

        if(empleado!=null && usuarioRepository.existsByEmpleadoIdAndIdNot(empleado.getId(),id)){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Este empleado ya tiene otro usuario asociado."
            );
        }

        return usuarioRepository.findById(id).map(usuario -> {

            usuario.setUsername(username);
            usuario.setRol(request.getRol());
            usuario.setEmpleado(empleado);

            if(request.getPassword()!=null && !request.getPassword().isBlank()){
                usuario.setPassword(passwordEncoder.encode(request.getPassword()));
            }

            return usuarioRepository.save(usuario);

        }).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "El usuario no existe."
        ));
    }

    @DeleteMapping("/{id}")
    public void eliminarUsuario(
            @PathVariable Long id,
            Authentication authentication){

        Usuario usuarioActual=usuarioRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "El usuario actual no existe."
                ));

        if(usuarioActual.getId().equals(id)){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "No puedes eliminar el usuario que tiene la sesión iniciada."
            );
        }

        usuarioRepository.deleteById(id);
    }

    private UsuarioResponse convertirAResponse(Usuario usuario){

        return new UsuarioResponse(
                usuario.getId(),
                usuario.getUsername(),
                usuario.getRol(),
                usuario.getEmpleado() != null ? usuario.getEmpleado().getId() : null,
                usuario.getEmpleado() != null ? usuario.getEmpleado().getNombre() : null
        );
    }
}