package com.vendorbase.repository;

import com.vendorbase.model.Supply;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplyRepository extends JpaRepository<Supply, Long> {
}
