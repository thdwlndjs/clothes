package com.example.springboot.service;

import com.example.springboot.dto.ProductDTO;
import com.example.springboot.entity.ProductEntity;
import com.example.springboot.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final SoldOutChecker soldOutChecker;

    @Transactional(readOnly = true)
    public List<ProductDTO> findAllDto() {
        return productRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"))
            .stream()
            .map(this::toDto)
            .toList();
    }

    @Transactional(readOnly = true)
    public ProductDTO findDtoById(Long id) {
        return productRepository.findById(id).map(this::toDto).orElse(null);
    }

    // 추가: OG는 DTO로 받되, soldOut만 서버에서 채움
    @Transactional
    public ProductDTO create(ProductDTO req) {
        boolean soldOut = soldOutChecker.check(req.getUrl());

        ProductEntity entity = ProductEntity.builder()
            .category(req.getCategory())
            .url(req.getUrl())
            .ogImage(req.getOgImage())
            .ogTitle(req.getOgTitle())
            .price(req.getPrice())
            .soldOut(soldOut)
            .build();

        return toDto(productRepository.save(entity));
    }

    @Transactional
    public void deleteById(Long id) {
        productRepository.deleteById(id);
    }

    // 스케줄러: 품절만 갱신(OG/Title은 손대지 않음)
    @Transactional
    public void refreshSoldOutAll() {
        List<ProductEntity> all = productRepository.findAll();
        for (ProductEntity p : all) {
            boolean now = soldOutChecker.check(p.getUrl());
            Boolean prev = p.getSoldOut();
            if (prev == null || prev != now) {
            	p.updateSoldOut(now);
            }
        }
    }

    private ProductDTO toDto(ProductEntity p) {
        return new ProductDTO(
            p.getId(),
            p.getCategory(),
            p.getUrl(),
            p.getOgImage(), 
            p.getOgTitle(),  
            p.getPrice(),
            p.getSoldOut()
        );
    }
}
