package com.example.springboot.scheduler;

import com.example.springboot.entity.ProductEntity;
import com.example.springboot.repository.ProductRepository;
import com.example.springboot.service.NotificationService;
import com.example.springboot.service.SoldOutChecker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationScheduler {

    private final ProductRepository productRepository;
    private final SoldOutChecker soldOutChecker;
    private final NotificationService notificationService;

    /**
     * 품절 상태만 주기적으로 갱신하고,
     * true -> false(재입고) 전환 시 Notification 생성.
     *
     * fixedDelay: 이전 실행이 끝난 뒤 delay 후 다시 실행 (중복 실행 방지에 유리)
     */
    @Scheduled(
            fixedDelayString = "${soldout.scheduler.delay-ms:60000}",
            initialDelayString = "${soldout.scheduler.initial-delay-ms:10000}"
    )
    @Transactional
    public void refreshSoldOutAndNotify() {
        List<ProductEntity> all = productRepository.findAll();

        int changed = 0;
        int restocked = 0;

        for (ProductEntity p : all) {
            try {
                boolean now = soldOutChecker.check(p.getUrl());
                boolean prev = Boolean.TRUE.equals(p.getIs_sold_out()); // null-safe

                // 상태 변화가 없으면 skip
                if (prev == now) continue;

                // DB 반영 (dirty checking)
                p.updateSoldOut(now);
                changed++;

                // 재입고 감지: prev=true(품절) -> now=false(재고있음)
                if (prev && !now) {
                    notificationService.createRestockNotification(p);
                    restocked++;
                    log.info("[RESTOCK] productId={} title={} url={}", p.getId(), p.getOg_title(), p.getUrl());
                }

            } catch (Exception e) {
                // 한 상품 실패가 전체 스케줄러를 죽이지 않도록 방어
                log.warn("[SOLDOUT_CHECK_FAIL] productId={} url={} msg={}",
                        p.getId(), p.getUrl(), e.getMessage());
            }
        }

        log.info("[SCHEDULER_DONE] total={} changed={} restocked={}", all.size(), changed, restocked);
    }
}
