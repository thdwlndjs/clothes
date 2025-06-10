const express = require('express');
const { extractOg } = require('../services/extractOg');  // 경로 맞춤 필요

const router = express.Router();

router.get('/', async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ error: 'url query parameter is required' });
  }

  try {
    const ogData = await extractOg(url);
    res.json(ogData);
  } catch (error) {
    console.error('OG 데이터 추출 실패:', error.message);
    res.status(500).json({ error: 'OG 데이터 추출 실패' });
  }
});

module.exports = router;
