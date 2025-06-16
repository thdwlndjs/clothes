const express = require('express');
const axios = require('axios');
const { isSoldOut } = require('../services/soldoutDetector');
const { Timestamp } = require('firebase-admin/firestore');
const { sendRestockNotification } = require('../services/notify');

module.exports = (db) => {
    const router = express.Router();

    // ✅ 공통 품절 상태 확인 및 Firestore 업데이트 함수
    async function checkAndUpdate(url) {
        const { data: html } = await axios.get(url, {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114.0.0.0 Safari/537.36',
            },
        });

        const soldOutStatus = isSoldOut(html);
        const docRef = db.collection('products').doc(encodeURIComponent(url));
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            await docRef.set({
                url,
                isSoldOut: soldOutStatus,
                updatedAt: Timestamp.now(),
            });
        } else {
            const prevData = docSnap.data();
            const hasChanged = prevData.isSoldOut !== soldOutStatus;

            if (hasChanged) {
                if (prevData.isSoldOut === true && soldOutStatus === false) {
                    sendRestockNotification(url);  // 🔔 재입고 알림
                }

                await docRef.update({
                    isSoldOut: soldOutStatus,
                    updatedAt: Timestamp.now(),
                });
            }
        }

        console.log(`${url} - 품절 상태: ${soldOutStatus ? '품절' : '재고 있음'}`);
        return { url, soldOutStatus };
    }

    // ✅ 단일 상품 점검 (GET /?url=...)
    router.get('/', async (req, res) => {
        const { url } = req.query;
        if (!url) return res.status(400).json({ error: 'url query parameter is required' });

        try {
            const result = await checkAndUpdate(url);
            res.json({ isSoldOut: result.soldOutStatus });
        } catch (error) {
            console.error('품절 체크 오류:', error.message);
            res.status(500).json({ error: '품절 상태 확인 실패' });
        }
    });

    // ✅ 전체 품절 상품 점검 (GET /all)
    router.get('/all', async (req, res) => {
        try {
            const snapshot = await db.collection('products')
                .where('isSoldOut', '==', true)
                .get();

            const results = [];

            for (const doc of snapshot.docs) {
                const data = doc.data();
                const result = await checkAndUpdate(data.url);
                results.push(result);
            }

            res.json({ message: '전체 품절 상품 점검 완료', results });
        } catch (error) {
            console.error('전체 점검 오류:', error.message);
            res.status(500).json({ error: '전체 품절 상태 점검 실패' });
        }
    });

    return router;
};
