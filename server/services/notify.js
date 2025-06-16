const admin = require("firebase-admin");
const db = require("./firebase"); 

async function sendRestockNotification(productUrl) {
  console.log(` 재입고 알림: ${productUrl}`);

  try {
    const snapshot = await db.collection("fcmTokens").get();

    if (snapshot.empty) {
      console.log(" 알림 보낼 토큰이 없음");
      return;
    }

    const sendPromises = [];

    snapshot.forEach(doc => {
      const { fcmToken } = doc.data();

      if (!fcmToken) return;

      const message = {
        token: fcmToken,
        notification: {
          title: " 재입고 알림",
          body: "찜한 상품이 다시 들어왔어요! 어서 확인하세용.",
        },
        webpush: {
          fcmOptions: {
            link: productUrl,
          },
        },
      };

      sendPromises.push(admin.messaging().send(message));
    });

    const results = await Promise.allSettled(sendPromises);
    const successCount = results.filter(r => r.status === "fulfilled").length;
    const failCount = results.length - successCount;

    console.log(` FCM 전송 성공: ${successCount},  실패: ${failCount}`);

  } catch (err) {
    console.error(" FCM 전송 중 에러 발생:", err);
  }
}

module.exports = { sendRestockNotification };
