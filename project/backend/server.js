import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from 'dotenv';
import { createPool } from 'mysql2';

// 환경 변수 설정
config();

const app = express();
const PORT = 3000;

// MySQL 연결 설정
const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

// MySQL 연결 풀 생성
const pool = createPool(dbConfig);

// MySQL 연결
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// 기본 라우트
app.get('/', (req, res) => {
    res.send('서버가 정상적으로 실행 중입니다!');
});

// // 일정 저장 API
// app.post('/api/Schedules', (req, res) => {
//     const { startDate, endDate, startTime, endTime, title, description } = req.body;

//     const query = `
//         INSERT INTO Schedules (
//             schedule_startDate,
//             schedule_endDate,
//             schedule_startTime,
//             schedule_endTime,
//             schedule_title,
//             schedule_details
//         ) VALUES (?, ?, ?, ?, ?, ?)
//     `;

//     pool.query(query, [startDate, endDate, startTime, endTime, title, description], (error, results) => {
//         if (error) {
//             console.error("데이터 삽입 오류:", error);
//             res.status(500).json({ success: false, message: "서버 오류", error: error.message });
//         } else {
//             res.status(201).json({ success: true, message: "일정이 저장되었습니다.", data: results });
//         }
//     });
// });

// // 일정 데이터 조회 API
// app.get('/api/Schedules', (req, res) => {
//     const query = 'SELECT * FROM Schedules';

//     pool.query(query, (error, results) => {
//         if (error) {
//             console.error('데이터 조회 오류:', error);
//             res.status(500).json({ success: false, message: '서버 오류' });
//         } else {
//             res.status(200).json({ success: true, data: results });
//         }
//     });
// });

// 서버 실행
app.listen(PORT, () => {
    console.log(` 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
