package com.example.backend.utils;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.example.backend.entity.Role;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Component
public class JwtUtil {

    private String secretKey = "topSecretKey";
    private Long accessTokenValidity = 1000 * 60 * 15L;
    private Long refreshTokenValidity = 1000 * 60 * 60 * 24 * 7L;
  

    public String generateAccessToken(String username, Set<Role> roles) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("roles", roles.stream().map(Role::getName).collect(Collectors.toSet()));
        return createToken(claims, username, accessTokenValidity);
    }

    public String generateRefreshToken(String username) {
        return createToken(new HashMap<>(), username, refreshTokenValidity);
    }

    private String createToken(Map<String, Object> claims, String subject, long validity) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + validity))
                .signWith(SignatureAlgorithm.HS256, secretKey)
                .compact();
    }

    public boolean validateToken(String token, String username) {
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody().getExpiration();
    }


    public String extractUsername(String token) {
        return Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody().getSubject();
    }

    public String extractRole(String token) {
        Claims claims = Jwts.parser().setSigningKey(secretKey).parseClaimsJws(token).getBody();
        return claims.get("role", String.class);
    }
}
