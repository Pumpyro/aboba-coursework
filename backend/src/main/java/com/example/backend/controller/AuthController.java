package com.example.backend.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend.entity.Role;
import com.example.backend.entity.User;
import com.example.backend.service.UserService;
import com.example.backend.utils.JwtUtil;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;



    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@RequestBody User user){
        try{
            userService.registerUser(user);
            return ResponseEntity.ok("Пользователь успешно зарегистрирован");
        } catch (IllegalArgumentException e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Ошибка сервера");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody User user, HttpServletResponse response) {
        if (userService.validateUser(user.getUsername(), user.getPassword())) {
            UserDetails userDetails = userService.
            loadUserByUsername(user.getUsername());
            UsernamePasswordAuthenticationToken authentication = 
            new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
            SecurityContextHolder.getContext().setAuthentication(authentication);

            Set<Role> roles = userService.getRolesByUsername(user.getUsername());
            String accessToken = jwtUtil.generateAccessToken(user.getUsername(), roles);
            String refreshToken = jwtUtil.generateRefreshToken(user.getUsername());

            Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
            refreshTokenCookie.setHttpOnly(true);
            refreshTokenCookie.setPath("/");
            refreshTokenCookie.setMaxAge(7*24*60*60);

            response.addCookie(refreshTokenCookie);

            Map<String, String> tokens = new HashMap<>();
            tokens.put("accessToken", accessToken);
            // tokens.put("refreshToken", refreshToken);
            return ResponseEntity.ok(tokens);
        } else {
            return ResponseEntity.status(401).body(Map.of("message", "Неверные учетные данные"));
        }
    }

    // @PostMapping("/refresh")
    // public ResponseEntity<Map<String, String>> refresh(@RequestBody Map<String, String> tokenMap) {
    //     String refreshToken = tokenMap.get("refreshToken");
    //     String username = jwtUtil.extractUsername(refreshToken);
    //     if (jwtUtil.validateToken(refreshToken, username)) {
    //         Set<Role> roles = userService.getRolesByUsername(username);
    //         String newAccessToken = jwtUtil.generateAccessToken(username, roles);
    //         return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
    //     } else {
    //         return ResponseEntity.status(401).body(Map.of("message", "Неверный refresh токен"));
    //     }
    // }




    @PostMapping("/refresh")
    public ResponseEntity<Map<String, String>> refresh(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        String refreshToken = null;
    
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }
    
        if (refreshToken != null) {

            try {
                String username = jwtUtil.extractUsername(refreshToken);
                if (jwtUtil.validateToken(refreshToken, username)) {
                    Set<Role> roles = userService.getRolesByUsername(username);
                    String newAccessToken = jwtUtil.generateAccessToken(username, roles);
                    return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
                } else {
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Неверный refresh токен"));
                }
            } catch (ExpiredJwtException e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Refresh токен истек"));
            }

        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Refresh токен не найден"));
        }
    }




}
