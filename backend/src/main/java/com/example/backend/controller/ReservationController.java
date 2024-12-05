package com.example.backend.controller;

import com.example.backend.dto.ReservationRequest;
import com.example.backend.entity.Reservation;
import com.example.backend.service.ReservationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @PostMapping("/book")
    public ResponseEntity<?> bookTable(@RequestBody ReservationRequest reservationRequest){
        Long tableId = reservationRequest.getTableId();
        String timeStart = reservationRequest.getTimeStart();
        Integer numberOfPeople = reservationRequest.getNumberOfPeople();
        String customerName = reservationRequest.getCustomerName();
        String customerPhone = reservationRequest.getCustomerPhone();
        LocalDateTime parsedTimeStart = LocalDateTime.parse(timeStart); // Ожидается ISO-8601 формат (e.g., 2024-11-22T14:00)
        Reservation reservation = reservationService.createReservation(tableId, customerName, numberOfPeople, parsedTimeStart, customerPhone);
        return ResponseEntity.ok(reservation);
    }


    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<String> handleIllegalStateException(IllegalStateException e) {
        return ResponseEntity.badRequest().body(e.getMessage()); // Возвращаем 400 и текст ошибки
    }
}
