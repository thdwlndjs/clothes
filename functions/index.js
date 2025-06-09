import * as functions from 'firebase-functions';
import express from 'express';
import axios from 'axios';
import cors from 'cors';

console.log('서버 시작ㅋ');

const app = express();
app.use(cors({ origin: true })); // Firebase Hosting과 호환되도록 origin: true 설정

app.get('/api/preview', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'url query parameter is required' });

  try {
    const response = await axios.get(url);
    const html = response.data;

    let ogImage = null;
    let ogTitle = null;

    const regex1 = /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i;
    const regex2 = /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i;

    const regex11 = /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i;
    const regex22 = /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i;

    const match1 = html.match(regex1);
    const match2 = html.match(regex2);

    const match11 = html.match(regex11);
    const match22 = html.match(regex22);

    if (match1) ogImage = match1[1];
    else if (match2) ogImage = match2[1];

    if (match11) ogTitle = match11[1];
    else if (match22) ogTitle = match22[1];

    res.json({ ogImage, ogTitle });
  } catch (error) {
    console.error('Error fetching preview:', error.message);
    res.status(500).json({ error: 'Failed to fetch URL' });
  }
});

// Firebase Functions로 export (app.listen 제거!)
export const api = functions.https.onRequest(app);
