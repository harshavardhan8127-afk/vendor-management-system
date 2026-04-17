package com.vendorbase.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "supplies")
public class Supply {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long vendorId;
    private String productName;
    private Integer quantity;
    private LocalDate deliveryDate;
    private String supplyStatus;

    public Supply() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getVendorId() { return vendorId; }
    public void setVendorId(Long vendorId) { this.vendorId = vendorId; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public LocalDate getDeliveryDate() { return deliveryDate; }
    public void setDeliveryDate(LocalDate deliveryDate) { this.deliveryDate = deliveryDate; }
    public String getSupplyStatus() { return supplyStatus; }
    public void setSupplyStatus(String supplyStatus) { this.supplyStatus = supplyStatus; }
}
