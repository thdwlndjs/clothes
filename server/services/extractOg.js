const axios = require('axios');

const headers = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
  'Referer': 'https://kamien.kr/',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
};

async function extractOg(url) {
  console.log('Request headers:', headers);

  const response = await axios.get(url, {
    headers,
  });

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

  if (match1) {
    ogImage = match1[1];
  } else if (match2) {
    ogImage = match2[1];
  }

  if (match11) {
    ogTitle = match11[1];
  } else if (match22) {
    ogTitle = match22[1];
  }

  return { ogImage, ogTitle };
}

module.exports = { extractOg };
