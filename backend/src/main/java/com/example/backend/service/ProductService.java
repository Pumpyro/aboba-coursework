package com.example.backend.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.backend.entity.Product;
import com.example.backend.repository.ProductRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;


    public Page<Product> getProducts(Pageable pageable, Specification<Product> spec){
        return productRepository.findAll(spec, pageable);
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public void deleteProduct(Long productId) {
        productRepository.deleteById(productId);
    }

    public String saveProductImage(Long productId, MultipartFile image) throws IOException {
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

    public void deleteProductImage(Long productId) throws IOException {
        String imageFolderPath = "uploads/images/";
        String imageFileName = "product" + productId + ".jpg";
        Path imagePath = Paths.get(imageFolderPath, imageFileName);

        // Удаляем файл, если он существует
        Files.deleteIfExists(imagePath);
    }
    
}
