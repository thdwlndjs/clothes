package com.example.springboot.service;

import com.example.springboot.entity.Notification;
import com.example.springboot.entity.ProductEntity;
import com.example.springboot.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public void createRestockNotification(ProductEntity p) {
        Notification n = Notification.builder()
                .type("RESTOCK")
                .productId(p.getId())
                .url(p.getUrl())
                .ogTitle(p.getOg_title())
                .isRead(false)
                .build();

        notificationRepository.save(n);
    }
}
