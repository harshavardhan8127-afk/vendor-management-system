package com.vendorbase.controller;

import com.vendorbase.model.Vendor;
import com.vendorbase.repository.PurchaseRepository;
import com.vendorbase.repository.TransactionRepository;
import com.vendorbase.repository.VendorRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final VendorRepository vendorRepository;
    private final TransactionRepository transactionRepository;
    private final PurchaseRepository purchaseRepository;

    public DashboardController(VendorRepository vendorRepository, TransactionRepository transactionRepository, PurchaseRepository purchaseRepository) {
        this.vendorRepository = vendorRepository;
        this.transactionRepository = transactionRepository;
        this.purchaseRepository = purchaseRepository;
    }

    // Parse human-entered money values like "₹25K", "30,000", "12500" or "12.5k"
    private double parseAmountString(String raw) {
        if (raw == null) return 0;
        String s = raw.replaceAll("[₹$,\\s]", "").toLowerCase();
        if (s.isEmpty()) return 0;
        double multiplier = 1.0;
        if (s.endsWith("k")) {
            multiplier = 1000.0;
            s = s.substring(0, s.length()-1);
        } else if (s.endsWith("m")) {
            multiplier = 1000000.0;
            s = s.substring(0, s.length()-1);
        }
        try {
            double val = Double.parseDouble(s);
            return val * multiplier;
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    @GetMapping("/summary")
    public Map<String, Object> getDashboardSummary(Principal principal) {
        Map<String, Object> summary = new HashMap<>();
        List<Vendor> userVendors = vendorRepository.findByOwnerUsername(principal.getName());
        List<Long> vendorIds = userVendors.stream().map(Vendor::getId).collect(Collectors.toList());
        
        summary.put("totalVendors", userVendors.size());
        
        double totalSpend = 0.0;
        
        // Add explicit total spend entries
        for (Vendor v : userVendors) {
            if (v.getTotalSpend() != null) {
                totalSpend += v.getTotalSpend();
            } else {
                String raw = v.getEmail();
                if (raw != null && !raw.isBlank()) {
                    totalSpend += parseAmountString(raw);
                }
            }
        }
        
        // Add transactions
        totalSpend += transactionRepository.findAll().stream()
                .filter(t -> vendorIds.contains(t.getVendorId()))
                .mapToDouble(t -> t.getAmount() == null ? 0 : t.getAmount())
                .sum();
                
        double avgRating = userVendors.stream()
                .mapToDouble(v -> v.getRating() == null ? 0 : v.getRating())
                .average()
                .orElse(0);
        int avgPerformance = (int) Math.round(avgRating * 20); // Converts 5.0 to 100%
        
        long openOrders = purchaseRepository.findAll().stream()
                .filter(p -> vendorIds.contains(p.getVendorId()))
                .filter(p -> !"Delivered".equalsIgnoreCase(p.getDeliveryStatus()) && !"Completed".equalsIgnoreCase(p.getDeliveryStatus()))
                .count();

        summary.put("totalSpend", totalSpend);
        summary.put("avgPerformance", avgPerformance);
        summary.put("openOrders", openOrders);
        
        return summary;
    }
}
