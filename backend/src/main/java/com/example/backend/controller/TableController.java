package com.example.backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.entity.CustomerTable;
import com.example.backend.repository.TableRepository;

@RestController
@RequestMapping("/api/tables")
public class TableController {

    @Autowired
    private TableRepository tableRepository;

    @GetMapping("/available")
    public ResponseEntity<List<CustomerTable>> getAvailableTables() {
        List<CustomerTable> availableTables = tableRepository.findByStatus("available");
        return ResponseEntity.ok(availableTables);
    }
}
