// 백엔드 서버 코드
const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// API 라우트 예시
app.get('/api', (req, res) => {
  res.json({ message: 'Hello from Express!' });
});

// 프론트엔드 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public')));

// 모든 다른 요청은 프론트엔드로 리다이렉트
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
