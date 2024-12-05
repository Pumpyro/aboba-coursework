package com.example.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.PaymentRequest;
import com.example.backend.service.PaymentService;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;


    @PostMapping("/process")
    public ResponseEntity<?> processPayment(@RequestBody PaymentRequest paymentRequest) {
        try {
            String transactionId = paymentService.processPayment(paymentRequest);
            return ResponseEntity.ok().body("Платеж успешно обработан. ID транзакции: " + transactionId);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Ошибка: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Ошибка сервера: " + e.getMessage());
        }
    }
}


