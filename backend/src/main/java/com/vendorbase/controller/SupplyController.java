package com.vendorbase.controller;

import com.vendorbase.model.Supply;
import com.vendorbase.repository.SupplyRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/supplies")
public class SupplyController {

    private final SupplyRepository supplyRepository;

    public SupplyController(SupplyRepository supplyRepository) {
        this.supplyRepository = supplyRepository;
    }

    @GetMapping
    public List<Supply> getAllSupplies() {
        return supplyRepository.findAll();
    }

    @PostMapping
    public Supply createSupply(@RequestBody Supply supply) {
        return supplyRepository.save(supply);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSupply(@PathVariable Long id) {
        return supplyRepository.findById(id)
                .map(supply -> {
                    supplyRepository.delete(supply);
                    return ResponseEntity.ok().build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
