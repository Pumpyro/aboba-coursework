package com.example.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.dto.PasswordChangeRequest;
import com.example.backend.dto.UpdateUserRequest;
import com.example.backend.dto.UserDataResponse;
import com.example.backend.entity.User;
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


    @GetMapping("/me")
public ResponseEntity<?> getUserData(Principal principal) {
    try {
        // Получение текущего пользователя по имени из Principal
        String username = principal.getName();
        UserDataResponse userData = userService.getUserData(username);

        return ResponseEntity.ok(userData);
    } catch (IllegalArgumentException e) {
        return ResponseEntity.badRequest().body("Ошибка: " + e.getMessage());
    } catch (Exception e) {
        return ResponseEntity.status(500).body("Ошибка сервера: " + e.getMessage());
    }
}

    @GetMapping("/users")
    public Page<User> getAllUsers(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        Page<User> users = userService.getAllUsers(page, size);
        return users;
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id, Principal principal) {
        String currentUsername = principal.getName();
        
        try {
            userService.deleteUser(id, currentUsername);
            return ResponseEntity.ok("Пользователь успешно удален.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Ошибка: " + e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Ошибка сервера: " + e.getMessage());
        }
    }

}
