package com.example.backend.service;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.backend.dto.PasswordChangeRequest;
import com.example.backend.dto.UpdateUserRequest;
import com.example.backend.dto.UserDataResponse;
import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.repository.RoleRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.security.UserDetailsImpl;

@Service
public class UserService implements UserDetailsService {
    

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;
    
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public User registerUser(User user){
        if (user.getUsername() == null || user.getEmail() == null || user.getPassword() == null) {
            throw new IllegalArgumentException("Error!");
        }
        if(userRepository.existsByUsername(user.getUsername()) || userRepository.existsByEmail(user.getEmail())){
            throw new IllegalStateException("Пользователь с таким именем или электронной мочтой уже существует.");
        }

        Role userRole = roleRepository.findByName("USER");
        user.setRoles(Set.of(userRole));
        String encodedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        return userRepository.save(user);
    }

    public boolean validateUser(String username, String password){
        User user = userRepository.findByUsername(username);    
        return user != null && passwordEncoder.matches(password, user.getPassword());
    }

    public Set<Role> getRolesByUsername(String username){
        User user = userRepository.findByUsername(username);
        return user != null ? user.getRoles() : new HashSet<>();
    }


    @Override
    public UserDetails loadUserByUsername(String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }
        return new UserDetailsImpl(user);
    }



     public void changeUserPassword(String username, PasswordChangeRequest request) {
        User user = userRepository.findByUsername(username);

        // Проверка текущего пароля
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Неверный текущий пароль");
        }

        // Проверка совпадения нового пароля и подтверждения
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new IllegalArgumentException("Новый пароль и подтверждение не совпадают");
        }

        // Обновление пароля
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public User updateUserData(String firstName, String lastName, String phoneNumber) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName(); // Получение имени пользователя из SecurityContext
        User user = userRepository.findByUsername(username);

        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }

        if (firstName != null) {
            user.setFirstName(firstName);
        }
        if (lastName != null) {
            user.setLastName(lastName);
        }
        if (phoneNumber != null) {
            user.setPhoneNumber(phoneNumber);
        }

        return userRepository.save(user);
    }

    public UserDataResponse getUserData(String username) {
    User user = userRepository.findByUsername(username);
    if (user == null) {
        throw new IllegalArgumentException("User not found");
    }
    // Создаем DTO для передачи данных пользователя
    UserDataResponse userData = new UserDataResponse();
    userData.setUsername(user.getUsername());
    userData.setEmail(user.getEmail());
    userData.setFirstName(user.getFirstName());
    userData.setLastName(user.getLastName());
    userData.setPhoneNumber(user.getPhoneNumber());

    return userData;
}

}
