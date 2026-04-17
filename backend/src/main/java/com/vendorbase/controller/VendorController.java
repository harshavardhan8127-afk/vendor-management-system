package com.vendorbase.controller;

import com.vendorbase.model.Vendor;
import com.vendorbase.repository.VendorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.security.Principal;

@RestController
@RequestMapping("/api/vendors")
public class VendorController {

    private final VendorRepository vendorRepository;

    public VendorController(VendorRepository vendorRepository) {
        this.vendorRepository = vendorRepository;
    }

    @GetMapping
    public List<Vendor> getAllVendors(Principal principal) {
        return vendorRepository.findByOwnerUsername(principal.getName());
    }

    @PostMapping
    public Vendor createVendor(@RequestBody Vendor vendor, Principal principal) {
        if (vendor.getRegistrationDate() == null) {
            vendor.setRegistrationDate(LocalDate.now());
        }
        vendor.setOwnerUsername(principal.getName());
        return vendorRepository.save(vendor);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vendor> getVendorById(@PathVariable Long id, Principal principal) {
        Optional<Vendor> vendor = vendorRepository.findById(id);
        if (vendor.isPresent() && vendor.get().getOwnerUsername().equals(principal.getName())) {
            return ResponseEntity.ok(vendor.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Vendor> updateVendor(@PathVariable Long id, @RequestBody Vendor vendorDetails, Principal principal) {
        return vendorRepository.findById(id)
                .filter(vendor -> vendor.getOwnerUsername().equals(principal.getName()))
                .map(vendor -> {
                    vendor.setVendorName(vendorDetails.getVendorName());
                    vendor.setContactPerson(vendorDetails.getContactPerson());
                    vendor.setEmail(vendorDetails.getEmail());
                    vendor.setPhoneNumber(vendorDetails.getPhoneNumber());
                    vendor.setAddress(vendorDetails.getAddress());
                    vendor.setCategory(vendorDetails.getCategory());
                    vendor.setCompanyName(vendorDetails.getCompanyName());
                    vendor.setStatus(vendorDetails.getStatus());
                    vendor.setRating(vendorDetails.getRating());
                    return ResponseEntity.ok(vendorRepository.save(vendor));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVendor(@PathVariable Long id, Principal principal) {
        return vendorRepository.findById(id)
                .filter(vendor -> vendor.getOwnerUsername().equals(principal.getName()))
                .map(vendor -> {
                    vendorRepository.delete(vendor);
                    return ResponseEntity.ok().build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
