import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from 'dotenv';
import scheduleRouter from './dist/scheduleService.js';
import userRouter from './dist/userService.js';

// 환경 변수 설정
config();

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// 기본 라우트
app.get('/', (req, res) => {
  res.send('서버가 정상적으로 실행 중입니다!');
});

// 일정 API 라우터
app.use('/api/Schedules', scheduleRouter);

// 회원가입 API 라우터
app.use('/api/User', userRouter);

// 오류 처리 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: '서버 오류 발생', error: err.message });
});

// 서버 실행
app.listen(PORT, () => {
  console.log(` 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
