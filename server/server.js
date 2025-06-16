const express = require('express');
const admin = require('firebase-admin');
const cors = require('cors');
const soldoutCheckRouter = require('./routes/soldoutCheck');
const ogScraperRouter = require('./routes/ogScraper');
const serviceAccount = require('./firebase-service-account.json');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://clothes-1e339.web.app'  
  ],
  credentials: true,
}));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// db 인자를 넘겨줘야 하는 라우터는 이렇게
app.use('/api/check-soldout', soldoutCheckRouter(db));

// 일반 라우터는 그대로 등록
app.use('/api/preview', ogScraperRouter);

app.get('/', (req, res) => {
  res.send('API Server is running');
});

const isCloudRun = !!process.env.PORT;
const PORT = isCloudRun ? process.env.PORT : 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

