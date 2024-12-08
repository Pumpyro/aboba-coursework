package com.example.backend.controller;

import com.example.backend.dto.ReviewRequest;
import com.example.backend.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/add")
    public ResponseEntity<?> addReview(@RequestBody ReviewRequest reviewRequest) {
        try {
            reviewService.saveReview(reviewRequest);
            return ResponseEntity.ok("Отзыв успешно добавлен");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Ошибка при добавлении отзыва: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok("Отзыв удален");
    }
}
