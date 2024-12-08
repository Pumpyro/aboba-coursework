package com.example.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PartnershipRequest {
    private String firstName;
    private String lastName;
    private String customerPhone;
    private String content;
}
