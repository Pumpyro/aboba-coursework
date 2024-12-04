package com.example.backend.repository;

import com.example.backend.entity.CustomerTable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TableRepository extends JpaRepository<CustomerTable, Long> {
}
