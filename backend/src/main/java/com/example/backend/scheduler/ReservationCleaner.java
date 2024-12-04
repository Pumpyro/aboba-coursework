package com.example.backend.scheduler;

import com.example.backend.entity.Reservation;
import com.example.backend.entity.CustomerTable;
import com.example.backend.repository.ReservationRepository;
import com.example.backend.repository.TableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class ReservationCleaner {

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private TableRepository tableRepository;

    @Scheduled(fixedRate = 60000) // Запускается каждые 60 секунд
    public void cleanExpiredReservations() {
        LocalDateTime now = LocalDateTime.now();
        List<Reservation> expiredReservations = reservationRepository.findByTimeEndBeforeAndStatus(now, "active");

        for (Reservation reservation : expiredReservations) {
            CustomerTable table = reservation.getTable();
            table.setStatus("available");
            tableRepository.save(table);

            reservation.setStatus("expired");
            reservationRepository.save(reservation);
        }
    }
}
