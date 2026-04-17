package com.vendorbase.controller;

import com.vendorbase.dto.AuthRequest;
import com.vendorbase.dto.AuthResponse;
import com.vendorbase.model.Admin;
import com.vendorbase.repository.AdminRepository;
import com.vendorbase.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(AdminRepository adminRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest authRequest) {
        Optional<Admin> adminOpt = adminRepository.findByUsername(authRequest.getUsername());
        
        if (adminOpt.isPresent() && passwordEncoder.matches(authRequest.getPassword(), adminOpt.get().getPassword())) {
            String token = jwtUtil.generateToken(authRequest.getUsername());
            return ResponseEntity.ok(new AuthResponse(token));
        }
        
        return ResponseEntity.status(401).body("Invalid credentials");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest authRequest) {
        if (adminRepository.findByUsername(authRequest.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        
        Admin newAdmin = new Admin(authRequest.getUsername(), passwordEncoder.encode(authRequest.getPassword()));
        adminRepository.save(newAdmin);
        
        return ResponseEntity.ok("Account created successfully!");
    }
}
