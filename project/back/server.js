// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');
const mysql = require('mysql2');

// 환경 변수 설정
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// MySQL 연결 설정
//
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

// MySQL2 연결 풀 생성
const pool = mysql.createPool(dbConfig);

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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

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
    console.log(`✅ 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
