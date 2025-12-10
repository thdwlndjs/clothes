package com.example.springboot.controller;

import com.example.springboot.entity.Product;
import com.example.springboot.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public List<Product> getAll() {
        return productService.findAll();
    }

    @PostMapping
    public Product create(@RequestBody Product p) {
        return productService.save(p);
    }
}
