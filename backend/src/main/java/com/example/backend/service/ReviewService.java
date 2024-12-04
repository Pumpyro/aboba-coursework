package com.example.backend.service;

import com.example.backend.dto.ReviewRequest;
import com.example.backend.entity.Review;
import com.example.backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public Review saveReview(ReviewRequest reviewRequest) {
        Review review = new Review();
        review.setFirstName(reviewRequest.getFirstName());
        review.setLastName(reviewRequest.getLastName());
        review.setContent(reviewRequest.getContent());
        return reviewRepository.save(review);
    }

    public void deleteReview(Long id){
        reviewRepository.deleteById(id);
    }
}
