package com.example.backend.filter;

import org.springframework.data.jpa.domain.Specification;

import com.example.backend.entity.Product;

public class ProductSpecification {

    public static Specification<Product> hasCategory(String category) {
        return (root, query, criteriaBuilder) ->
                category == null ? null : criteriaBuilder.equal(root.get("category"), category);
    }

    public static Specification<Product> hasPriceBetween(Double minPrice, Double maxPrice) {
        return (root, query, criteriaBuilder) -> {
            if (minPrice == null && maxPrice == null) return null;
            if (minPrice != null && maxPrice != null) {
                return criteriaBuilder.between(root.get("price"), minPrice, maxPrice);
            } else if (minPrice != null) {
                return criteriaBuilder.greaterThanOrEqualTo(root.get("price"), minPrice);
            } else {
                return criteriaBuilder.lessThanOrEqualTo(root.get("price"), maxPrice);
            }
        };
    }

    public static Specification<Product> hasNameLike(String name) {
        return (root, query, criteriaBuilder) -> {
            if (name == null || name.trim().isEmpty()) {
                return null; // Если имя не передано, условие не добавляется
            }
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%" + name.toLowerCase() + "%");
        };
    }
    
}
