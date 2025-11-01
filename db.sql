-- Reset
DROP DATABASE IF EXISTS petshopdb;

-- Create database
CREATE DATABASE petshopdb;

-- Select database
USE petshopdb;


-- Create products
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(256),
    description VARCHAR(256),
    price DECIMAL(6,2)
);

-- Create customers table
CREATE TABLE customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(128),
    email VARCHAR(128),
    phone VARCHAR(32),
    address VARCHAR(128)
);

-- Create orders
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    customer_id INT,
    quantity INT,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Create services table
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(32),
    description VARCHAR(128),
    price DECIMAL(6,2)
);

-- Create pets table
CREATE TABLE pets (
    id INT PRIMARY KEY AUTO_INCREMENT, 
    name VARCHAR(128),
    race VARCHAR(32),
    type VARCHAR(16),
    customer_id INT,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
);

-- Create bookings table
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pet_id INT,
    service_id INT,
    pet_owner INT,
    observations VARCHAR(256),
    FOREIGN KEY (service_id) REFERENCES services(id),
    FOREIGN KEY (pet_owner) REFERENCES customers(id),
    FOREIGN KEY (pet_id) REFERENCES pets(id)
);

-- Create employees table
CREATE TABLE employees (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(128),
    email VARCHAR(256),
    password VARCHAR(64),
    date DATE
);

