package com.example.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserDataResponse {
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String phoneNumber;
}
