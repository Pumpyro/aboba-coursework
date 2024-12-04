package com.example.backend.dto;


import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ReservationRequest {
    private Long tableId;
    private String timeStart;
    private Integer numberOfPeople;
    private String customerName;
    private String customerPhone;

    // Геттеры и сеттеры
}

