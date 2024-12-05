package com.example.backend.repository;

import com.example.backend.entity.CustomerTable;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TableRepository extends JpaRepository<CustomerTable, Long> {
    List<CustomerTable> findByStatus(String status);
}
