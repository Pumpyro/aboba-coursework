package com.example.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.backend.entity.Product;
import com.example.backend.repository.ProductRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;


    public Page<Product> getProducts(Pageable pageable, Specification<Product> spec){
        return productRepository.findAll(spec, pageable);
    }
    
}
