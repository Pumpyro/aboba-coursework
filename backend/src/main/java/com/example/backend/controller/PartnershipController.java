package com.example.backend.controller;

import com.example.backend.dto.PartnershipRequest;
import com.example.backend.entity.Partnership;
import com.example.backend.entity.Review;
import com.example.backend.service.PartnershipService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/partnerships")
public class PartnershipController {

    @Autowired
    private PartnershipService partnershipService;

    @PostMapping("/add")
    public ResponseEntity<?> addPartnership(@RequestBody PartnershipRequest partnershipRequest) {
        try {
            partnershipService.savePartnership(partnershipRequest);
            return ResponseEntity.ok("Заявка о сотрудничестве успешно добавлена");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Ошибка при добавлении заявки о сотрудничестве: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deletePartnership(@PathVariable Long id) {
        partnershipService.deletePartnership(id);
        return ResponseEntity.ok("Заявка о сотрудничестве удалена");
    }

    @GetMapping
    public Page<Partnership> getAllPartnerships(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        Page<Partnership> partnerships = partnershipService.getAllPartnerships(page, size);
        return partnerships;
    }
    
}
