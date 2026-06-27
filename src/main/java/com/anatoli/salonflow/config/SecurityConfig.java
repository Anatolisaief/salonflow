package com.anatoli.salonflow.config;

import com.anatoli.salonflow.service.UsuarioDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.http.HttpMethod;

@Configuration
public class SecurityConfig{

    private final UsuarioDetailsService usuarioDetailsService;

    public SecurityConfig(UsuarioDetailsService usuarioDetailsService){
        this.usuarioDetailsService=usuarioDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider provider=new DaoAuthenticationProvider();
        provider.setUserDetailsService(usuarioDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception{
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
        http
                .csrf(csrf->csrf.disable())
                .authorizeHttpRequests(auth->auth

                        .requestMatchers(
                                "/css/**",
                                "/js/**",
                                "/img/**",
                                "/login.html",
                                "/acceso-denegado.html"
                        ).permitAll()

                        // EMPLEADO y ADMIN pueden consultar listas
                        .requestMatchers(HttpMethod.GET,
                                "/empleados/**",
                                "/productos/**",
                                "/promociones/**"
                        ).hasAnyRole("ADMIN","EMPLEADO")

                        // Solo ADMIN puede acceder a estas páginas y modificar datos
                        .requestMatchers(
                                "/empleados.html",
                                "/productos.html",
                                "/promociones.html",
                                "/empleados/**",
                                "/productos/**",
                                "/promociones/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                                "/index.html",
                                "/clientes.html",
                                "/cliente-detalle.html",
                                "/citas.html",
                                "/servicios.html",
                                "/clientes/**",
                                "/citas/**",
                                "/servicios/**"
                        ).hasAnyRole("ADMIN","EMPLEADO")

                        .anyRequest().authenticated()
                )
                .exceptionHandling(exception->exception
                        .accessDeniedPage("/acceso-denegado.html")
                )

                .formLogin(form->form
                        .loginPage("/login.html")
                        .loginProcessingUrl("/login")
                        .defaultSuccessUrl("/index.html",true)
                        .failureUrl("/login.html?error")
                        .permitAll()
                )
                .logout(logout->logout
                        .logoutUrl("/logout")
                        .logoutSuccessUrl("/login.html?logout")
                        .permitAll()
                );

        return http.build();
    }
}