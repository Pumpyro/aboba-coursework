package com.example.backend.controller;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

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
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Specification<Product> spec = Specification
                .where(ProductSpecification.hasCategory(category))
                .and(ProductSpecification.hasPriceBetween(minPrice, maxPrice));

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
            String imagePath = saveProductImage(savedProduct.getId(), image);
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
            deleteProductImage(id);

            return ResponseEntity.ok("Продукт успешно удален");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Ошибка при удалении продукта: " + e.getMessage());
        }
    }


    private String saveProductImage(Long productId, MultipartFile image) throws IOException {
        // String imageFolderPath = "src/main/resources/public/images/";
        String imageFolderPath = "uploads/images/";
        String imageFileName = "product" + productId + ".jpg"; // Сохраняем как product{id}.jpg
        Path imagePath = Paths.get(imageFolderPath, imageFileName);

        // Создаем директорию, если она не существует
        Files.createDirectories(imagePath.getParent());

        // Сохраняем файл

        byte[] imageBytes = image.getBytes();
        System.out.println("Размер файла в байтах: " + imageBytes.length);
        System.out.println("Сохраняем изображение в: " + imagePath.toAbsolutePath());
        try {
            Files.write(imagePath, image.getBytes());
            System.out.println("Изображение сохранено успешно.");
        } catch (IOException e) {
            System.err.println("Ошибка при сохранении изображения: " + e.getMessage());
            e.printStackTrace();
        }
        System.out.println("Попытка сохранения изображения");

        // Возвращаем путь для сохранения в БД
        return "/images/" + imageFileName;
    }

    private void deleteProductImage(Long productId) throws IOException {
        String imageFolderPath = "src/main/resources/public/images/";
        String imageFileName = "product" + productId + ".jpg";
        Path imagePath = Paths.get(imageFolderPath, imageFileName);

        // Удаляем файл, если он существует
        Files.deleteIfExists(imagePath);
    }
}
