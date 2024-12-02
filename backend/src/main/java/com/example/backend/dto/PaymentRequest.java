package com.example.backend.dto;

import java.math.BigDecimal;
import java.util.Map;

import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class PaymentRequest {
    private String accountNumber;
    private String pinCode;
    private BigDecimal orderAmount;
    private Long userId;
    private Map<Long, Integer> products;
}

