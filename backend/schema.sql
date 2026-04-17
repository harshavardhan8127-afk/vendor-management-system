CREATE DATABASE IF NOT EXISTS vendorbase;
USE vendorbase;

CREATE TABLE admins (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE vendors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone_number VARCHAR(50),
    address TEXT,
    category VARCHAR(100),
    company_name VARCHAR(255),
    registration_date DATE,
    status VARCHAR(50),
    rating DOUBLE
);

CREATE TABLE transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id BIGINT,
    transaction_date DATE,
    transaction_type VARCHAR(100),
    amount DOUBLE,
    payment_status VARCHAR(50),
    notes TEXT,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
);

CREATE TABLE purchases (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id BIGINT,
    item_name VARCHAR(255),
    quantity INT,
    price DOUBLE,
    purchase_date DATE,
    delivery_status VARCHAR(50),
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
);

CREATE TABLE supplies (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    vendor_id BIGINT,
    product_name VARCHAR(255),
    quantity INT,
    delivery_date DATE,
    supply_status VARCHAR(50),
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
);

INSERT INTO admins (username, password) VALUES ('admin', '$2a$10$wT/p09P72eF.d8w.C06.qeV.H5XU37.O45a5dG1.c7J2GZ0Ea.wX6');
