package com.example.backend.service;

import com.example.backend.entity.Reservation;
import com.example.backend.entity.CustomerTable;
import com.example.backend.repository.ReservationRepository;
import com.example.backend.repository.TableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private TableRepository tableRepository;

    public Reservation createReservation(Long tableId, String customerName, int numberOfPeople, LocalDateTime timeStart) {
        CustomerTable table = tableRepository.findById(tableId)
                .orElseThrow(() -> new IllegalArgumentException("Столик с ID " + tableId + " не найден"));

        if (!"available".equals(table.getStatus())) {
            throw new IllegalStateException("Столик с ID " + tableId + " уже занят");
        }

        table.setStatus("reserved");
        tableRepository.save(table);

        Reservation reservation = new Reservation();
        reservation.setCustomerName(customerName);
        reservation.setNumberOfPeople(numberOfPeople);
        reservation.setTimeStart(timeStart);
        reservation.setTimeEnd(timeStart.plusMinutes(2)); // Бронирование на 1,5 часа
        reservation.setTable(table);

        return reservationRepository.save(reservation);
    }
}
