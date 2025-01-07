import { config } from 'dotenv';
config();
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import scheduleRouter from './dist/scheduleService.js';
import userRouter from './dist/userService.js';
import projectServiceRouter from './dist/projectService.js';
import projectDashBoardRouter from './dist/projectDashBoard.js';
import projectEachDetailsRouter from './dist/projectEachDetails.js';
import mainDashBoardRouter from './dist/mainDashBoard.js';
// 환경 변수 설정


const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors({
  // origin: ['https://oz-project-2team.kro.kr', 'http://localhost:5175'],
  origin: "*",
  methods: ['GET', 'PUT', 'POST', 'DELETE'],  // 허용할 메서드
  allowedHeaders: ['Content-Type', 'Authorization']  // 허용할 헤더
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// 기본 라우트
app.get('/', (req, res) => {
  res.send('서버가 정상적으로 실행 중입니다!');
});

// 메인 API 라우터
app.use('/api/MainDashBoard', mainDashBoardRouter);

// 일정 API 라우터
app.use('/api/Schedules', scheduleRouter);

// 회원가입 API 라우터
app.use('/api/User', userRouter);

// 프로젝트 API 라우터
app.use('/api/ProjectService', projectServiceRouter);
app.use('/api/ProjectDashBoard', projectDashBoardRouter);
app.use('/api/ProjectEachDetails', projectEachDetailsRouter);

// 오류 처리 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: '서버 오류 발생', error: err.message });
});

// 서버 실행
app.listen(PORT, () => {
  console.log(` 서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
