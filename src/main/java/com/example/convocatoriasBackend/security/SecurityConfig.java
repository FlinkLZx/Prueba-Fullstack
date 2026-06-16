package com.example.convocatoriasBackend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .headers(headers -> headers.frameOptions(frame -> frame.disable())) // For H2 console
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/auth/login").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                
                // User CRUD endpoints (Admin only)
                .requestMatchers("/api/usuarios/**").hasRole("ADMINISTRADOR")
                
                // Categorias CRUD (Admin only for writes, others for reads)
                .requestMatchers(HttpMethod.GET, "/api/categorias/**").hasAnyRole("ADMINISTRADOR", "DOCENTE", "ESTUDIANTE")
                .requestMatchers("/api/categorias/**").hasRole("ADMINISTRADOR")
                
                // Convocatorias CRUD (Admin only for writes, others for reads)
                .requestMatchers(HttpMethod.GET, "/api/convocatorias/**").hasAnyRole("ADMINISTRADOR", "DOCENTE", "ESTUDIANTE")
                .requestMatchers("/api/convocatorias/**").hasRole("ADMINISTRADOR")
                
                // Postulaciones endpoints
                .requestMatchers(HttpMethod.POST, "/api/postulaciones").hasRole("ESTUDIANTE")
                .requestMatchers(HttpMethod.GET, "/api/postulaciones").hasRole("ADMINISTRADOR")
                .requestMatchers(HttpMethod.PUT, "/api/postulaciones/*/estado").hasRole("ADMINISTRADOR")
                
                // Reportes endpoints (Admin only)
                .requestMatchers("/api/reportes/**").hasRole("ADMINISTRADOR")
                
                .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Collections.singletonList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept"));
        configuration.setExposedHeaders(Collections.singletonList("Authorization"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
