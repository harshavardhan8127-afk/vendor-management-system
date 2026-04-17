package com.vendorbase.repository;

import com.vendorbase.model.Vendor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VendorRepository extends JpaRepository<Vendor, Long> {
    List<Vendor> findByOwnerUsername(String ownerUsername);
    long countByOwnerUsername(String ownerUsername);
}
