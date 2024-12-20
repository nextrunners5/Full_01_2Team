// server.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from 'dotenv';
import { createPool } from 'mysql2';

// 환경 변수 설정
config();

const app = express();
const PORT = process.env.PORT || 3000;

// MySQL 연결 설정
const dbConfig = {
    host: process.env.DB_HOST || "127.0.0.1",
    user: process.env.DB_USER ||  "root",
    password: process.env.DB_PASSWORD || "1234",
    database: process.env.DB_NAME || "my_database",
};

// MySQL 연결 풀 생성
const pool = createPool(dbConfig);

// MySQL 연결 테스트
pool.getConnection((err, connection) => {
    if (err) {
        console.error(' MySQL 데이터베이스 연결 실패:', err);
        process.exit(1);
    } else {
        console.log(' MySQL 데이터베이스 연결 성공');
        connection.release();
    }
});

// 미들웨어 설정
app.use(cors());
app.use(express.json()); // JSON 요청 파싱
app.use(express.urlencoded({ extended: true })); // URL-encoded 요청 파싱
app.use(morgan('dev')); // HTTP 요청 로깅

// 기본 라우트
app.get('/', (req, res) => {
    res.send('서버가 정상적으로 실행 중입니다!');
});

// API 예제 라우트 (MySQL 쿼리)
app.get('/api/test', (req, res) => {
    const query = 'SELECT NOW() AS currentTime';
    pool.query(query, (error, results) => {
        if (error) {
            console.error('쿼리 에러:', error);
            res.status(500).json({ success: false, message: '서버 에러 발생' });
        } else {
            res.json({ success: true, data: results });
        }
    });
});

// 서버 실행
app.listen(PORT, () => {
    console.log(` 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
