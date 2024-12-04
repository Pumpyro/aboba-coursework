package com.example.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.PasswordChangeRequest;
import com.example.backend.dto.UpdateUserRequest;
import com.example.backend.service.UserService;

import java.security.Principal;

@RestController
@RequestMapping("/api/account")
public class UserAccountController {

    @Autowired
    private UserService userService;

    @PatchMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody PasswordChangeRequest request, Principal principal) {
        try {
            userService.changeUserPassword(principal.getName(), request);
            return ResponseEntity.ok("Пароль успешно изменен");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ошибка сервера: " + e.getMessage());
        }
    }


    @PutMapping("/update")
    public ResponseEntity<?> updateUserData(
            @RequestBody UpdateUserRequest updateUserRequest) {
        try {
            userService.updateUserData(
                    updateUserRequest.getFirstName(),
                    updateUserRequest.getLastName(),
                    updateUserRequest.getPhoneNumber()
            );

            return ResponseEntity.ok("Данные пользователя успешно обновлены");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Ошибка: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Ошибка сервера: " + e.getMessage());
        }
    }
}
