function sendRestockNotification(productUrl) {
    console.log(`[알림] 재입고 알림: ${productUrl} 상품이 품절 해제되었습니다.`);
    // 실제 서비스에서는 FCM, 이메일, SMS 등으로 확장 가능
  }
  
  module.exports = { sendRestockNotification };
  