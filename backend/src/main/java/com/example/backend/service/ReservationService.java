package com.example.backend.service;

import com.example.backend.entity.Reservation;
import com.example.backend.entity.User;
import com.example.backend.entity.CustomerTable;
import com.example.backend.repository.ReservationRepository;
import com.example.backend.repository.TableRepository;
import com.example.backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private TableRepository tableRepository;
    
    @Autowired
    private UserRepository userRepository;

    public Reservation createReservation(Long tableId, String customerName, int numberOfPeople, LocalDateTime timeStart, String customerPhone) {
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
        reservation.setTimeEnd(timeStart.plusMinutes(1)); // Бронирование на 1,5 часа
        reservation.setTable(table);
        reservation.setCustomerPhone(customerPhone);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        
        User user = userRepository.findByUsername(username);
        if (user == null) {
            reservation.setUserId(null);
        }else{
            reservation.setUserId(user.getId());
        }

        return reservationRepository.save(reservation);
    }
}
