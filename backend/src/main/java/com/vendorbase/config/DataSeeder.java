package com.vendorbase.config;

import com.vendorbase.model.Admin;
import com.vendorbase.model.Vendor;
import com.vendorbase.model.Purchase;
import com.vendorbase.model.Transaction;
import com.vendorbase.repository.AdminRepository;
import com.vendorbase.repository.VendorRepository;
import com.vendorbase.repository.PurchaseRepository;
import com.vendorbase.repository.TransactionRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initData(AdminRepository adminRepository, VendorRepository vendorRepository, PurchaseRepository purchaseRepository, TransactionRepository transactionRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (adminRepository.findByUsername("admin").isEmpty()) {
                Admin admin = new Admin();
                admin.setUsername("admin");
                admin.setPassword(passwordEncoder.encode("password"));
                adminRepository.save(admin);
            }

            // Seed example vendors, purchases and transactions for the demo admin
            if (vendorRepository.count() == 0) {
                Vendor v1 = new Vendor();
                v1.setVendorName("Acme Corp");
                v1.setContactPerson("John Doe");
                v1.setEmail("john@acme.com");
                v1.setPhoneNumber("123-456-7890");
                v1.setAddress("123 Acme St, NY");
                v1.setCategory("Electronics");
                v1.setCompanyName("Acme Corporation");
                v1.setRegistrationDate(LocalDate.now().minusDays(10));
                v1.setStatus("Active");
                v1.setRating(4.5);
                v1.setOwnerUsername("admin");
                vendorRepository.save(v1);

                Vendor v2 = new Vendor();
                v2.setVendorName("Global Supplies");
                v2.setContactPerson("Jane Smith");
                v2.setEmail("jane@globalsupplies.com");
                v2.setPhoneNumber("987-654-3210");
                v2.setAddress("456 Global Ave, CA");
                v2.setCategory("Office Supplies");
                v2.setCompanyName("Global Supplies LLC");
                v2.setRegistrationDate(LocalDate.now().minusDays(20));
                v2.setStatus("Inactive");
                v2.setRating(3.8);
                v2.setOwnerUsername("admin");
                vendorRepository.save(v2);

                // Add a sample purchase (open order) for v1
                Purchase p1 = new Purchase();
                p1.setVendorId(v1.getId());
                p1.setItemName("Capacitors");
                p1.setQuantity(500);
                p1.setPrice(12500.0);
                p1.setPurchaseDate(LocalDate.now().minusDays(2));
                p1.setDeliveryStatus("Pending");
                purchaseRepository.save(p1);

                // Add a sample transaction for v1
                Transaction t1 = new Transaction();
                t1.setVendorId(v1.getId());
                t1.setTransactionDate(LocalDate.now().minusDays(1));
                t1.setTransactionType("Purchase");
                t1.setAmount(12500.0);
                t1.setPaymentStatus("Pending");
                t1.setNotes("Initial order");
                transactionRepository.save(t1);
            }
        };
    }
}
