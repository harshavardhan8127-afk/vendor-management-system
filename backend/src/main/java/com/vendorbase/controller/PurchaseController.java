package com.vendorbase.controller;

import com.vendorbase.model.Purchase;
import com.vendorbase.repository.PurchaseRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchases")
public class PurchaseController {

    private final PurchaseRepository purchaseRepository;

    public PurchaseController(PurchaseRepository purchaseRepository) {
        this.purchaseRepository = purchaseRepository;
    }

    @GetMapping
    public List<Purchase> getAllPurchases() {
        return purchaseRepository.findAll();
    }

    @PostMapping
    public Purchase createPurchase(@RequestBody Purchase purchase) {
        return purchaseRepository.save(purchase);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePurchase(@PathVariable Long id) {
        return purchaseRepository.findById(id)
                .map(purchase -> {
                    purchaseRepository.delete(purchase);
                    return ResponseEntity.ok().build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
