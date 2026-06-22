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
                // First, disable CSRF and configure CORS to prevent 403 Forbidden on write methods (POST, PUT, DELETE)
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .headers(headers -> headers.frameOptions(frame -> frame.disable())) // For H2 console
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers("/api/auth/**").permitAll() // Changed to wildcard to allow all auth endpoints
                        .requestMatchers("/h2-console/**").permitAll()

                        // User CRUD endpoints (Admin only)
                        .requestMatchers("/api/usuarios", "/api/usuarios/**").hasAnyAuthority("ROLE_ADMINISTRADOR", "ADMINISTRADOR")

                        // Categorias CRUD (Admin only for writes, others for reads)
                        .requestMatchers(HttpMethod.GET, "/api/categorias", "/api/categorias/**").permitAll() // Temporarily public for easier frontend testing
                        .requestMatchers("/api/categorias", "/api/categorias/**").hasAnyAuthority("ROLE_ADMINISTRADOR", "ADMINISTRADOR")

                        // Convocatorias CRUD (Admin only for writes, others for reads)
                        .requestMatchers(HttpMethod.GET, "/api/convocatorias", "/api/convocatorias/**").permitAll() // Temporarily public for easier frontend testing
                        .requestMatchers("/api/convocatorias", "/api/convocatorias/**").hasAnyAuthority("ROLE_ADMINISTRADOR", "ADMINISTRADOR")

                        // Postulaciones endpoints
                        .requestMatchers(HttpMethod.POST, "/api/postulations").hasAnyAuthority("ROLE_ESTUDIANTE", "ROLE_ADMINISTRADOR", "ESTUDIANTE", "ADMINISTRADOR")
                        .requestMatchers(HttpMethod.GET, "/api/postulations").hasAnyAuthority("ROLE_ADMINISTRADOR", "ROLE_DOCENTE", "ADMINISTRADOR", "DOCENTE")
                        .requestMatchers("/api/postulations/**").hasAnyAuthority("ROLE_ADMINISTRADOR", "ROLE_DOCENTE", "ROLE_ESTUDIANTE", "ADMINISTRADOR", "DOCENTE", "ESTUDIANTE")

                        // Reportes endpoints (Admin only)
                        .requestMatchers("/api/reportes", "/api/reportes/**").hasAnyAuthority("ROLE_ADMINISTRADOR", "ADMINISTRADOR")

                        .anyRequest().authenticated()
                );

        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Collections.singletonList("*"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept"));
        configuration.setExposedHeaders(Collections.singletonList("Authorization"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}