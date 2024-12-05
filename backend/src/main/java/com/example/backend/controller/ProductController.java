package com.example.backend.controller;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.entity.Product;
import com.example.backend.filter.ProductSpecification;
import com.example.backend.service.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public Page<Product> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Specification<Product> spec = Specification
                .where(ProductSpecification.hasCategory(category))
                .and(ProductSpecification.hasPriceBetween(minPrice, maxPrice))
                .and(ProductSpecification.hasNameLike(name));

        PageRequest pageable = PageRequest.of(page, size);
        return productService.getProducts(pageable, spec);
    }


    @PostMapping("/add")
    public ResponseEntity<?> addProduct(
            @RequestParam String name,
            @RequestParam String description,
            @RequestParam BigDecimal price,
            @RequestParam String category,
            @RequestParam("image") MultipartFile image) {
        try {
            Product newProduct = new Product();
            newProduct.setName(name);
            newProduct.setDescription(description);
            newProduct.setPrice(price);
            newProduct.setCategory(category);

            // Сохраняем продукт в БД, чтобы получить его ID
            Product savedProduct = productService.saveProduct(newProduct);

            // Сохраняем изображение
            String imagePath = productService.saveProductImage(savedProduct.getId(), image);
            savedProduct.setImageUrl(imagePath);

            // Обновляем продукт с сохраненным изображением
            productService.saveProduct(savedProduct);

            return ResponseEntity.ok(savedProduct);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Ошибка при добавлении продукта: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);

            // Удаляем изображение продукта
            productService.deleteProductImage(id);

            return ResponseEntity.ok("Продукт успешно удален");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Ошибка при удалении продукта: " + e.getMessage());
        }
    }



}
