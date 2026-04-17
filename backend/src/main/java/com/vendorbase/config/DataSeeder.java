package com.vendorbase.config;

import com.vendorbase.model.Admin;
import com.vendorbase.model.Vendor;
import com.vendorbase.repository.AdminRepository;
import com.vendorbase.repository.VendorRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initData(AdminRepository adminRepository, VendorRepository vendorRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (adminRepository.findByUsername("admin").isEmpty()) {
                Admin admin = new Admin();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("password"));
                adminRepository.save(admin);
            }
        };
    }
}
