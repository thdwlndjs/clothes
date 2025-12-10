package com.example.springboot.service;

import com.example.springboot.entity.Product;
import com.example.springboot.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public Product save(Product p) {
        return productRepository.save(p);
    }

    public Product findById(Long id) {
        return productRepository.findById(id).orElse(null);
    }
}
