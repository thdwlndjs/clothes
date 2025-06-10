const express = require('express');
const axios = require('axios');
const { isSoldOut } = require('../services/soldoutDetector');  // 이름 일치시키기
const { Timestamp } = require('firebase-admin/firestore');

module.exports = (db) => {
    const router = express.Router();

    router.get('/', async (req, res) => {
        const { url } = req.query;
        if (!url) return res.status(400).json({ error: 'url query parameter is required' });

        try {
            const { data: html } = await axios.get(url, {
                headers: {
                    'User-Agent':
                        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/114.0.0.0 Safari/537.36',
                },
            });

            const soldOutStatus = isSoldOut(html);  // 이름 맞춤

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
                if (prevData.isSoldOut !== soldOutStatus) {
                    await docRef.update({
                        isSoldOut: soldOutStatus,
                        updatedAt: Timestamp.now(),
                    });
                }
            }

            console.log(`${url} - 품절 상태: ${soldOutStatus ? '품절' : '재고 있음'}`);

            res.json({ isSoldOut: soldOutStatus });
        } catch (error) {
            console.error('품절 체크 오류:', error.message);
            res.status(500).json({ error: '품절 상태 확인 실패' });
        }
    });

    return router;
};
