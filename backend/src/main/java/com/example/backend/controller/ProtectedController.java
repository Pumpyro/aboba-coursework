package com.example.backend.controller;

import java.util.HashMap;
import java.util.Map;
// import java.util.Set;
// import java.util.stream.Collectors;

// import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// import com.example.backend.security.UserDetailsImpl;

@RestController
@RequestMapping("/api/protected")
public class ProtectedController {

    @GetMapping("/data")
    public Map<String, Object> getProtectedData() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // if (authentication != null) {
        //     return authentication.getAuthorities().stream()
        //             .map(grantedAuthority -> grantedAuthority.getAuthority())
        //             .collect(Collectors.toSet());
        // }
        // return Set.of("No roles found");

        if (authentication != null){
            Map<String, Object> info = new HashMap<>();
            info.put("username", authentication.getName()); // Имя пользователя (логин)

            return info;
        }
        return Map.of("error", "No authentication found");
    }
}
