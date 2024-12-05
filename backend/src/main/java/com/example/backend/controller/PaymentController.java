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
            System.out.println("1");
            String transactionId = paymentService.processPayment(paymentRequest);
            System.out.println("4523421");
            return ResponseEntity.ok().body("Платеж успешно обработан. ID транзакции: " + transactionId);
        } catch (IllegalArgumentException e) {
            System.out.println("2");
            return ResponseEntity.badRequest().body("Ошибка: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("3");
            return ResponseEntity.status(500).body("Ошибка сервера: " + e.getMessage());
        }
    }
}


