import { config } from 'dotenv';
config();
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import scheduleRouter from './dist/scheduleService.js';
import userRouter from './dist/userService.js';
import projectServiceRouter from './dist/projectService.js';
import projectDashBoardRouter from './dist/projectDashBoard.js';
// 환경 변수 설정


console.log('DB_HOST:', process.env.DB_HOST);  // 제대로 로드된 값 출력
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('PORT:', process.env.PORT);
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

// 프로젝트 API 라우터
app.use('/api/ProjectService', projectServiceRouter);
app.use('/api/ProjectDashBoard', projectDashBoardRouter);

// 오류 처리 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: '서버 오류 발생', error: err.message });
});

// 서버 실행
app.listen(PORT, () => {
  console.log(` 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
