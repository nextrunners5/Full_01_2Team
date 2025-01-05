import { config } from 'dotenv';
config();  // 환경 변수 로드
import { Request, Response, Router } from "express";
import { RowDataPacket } from "mysql2";
import pool from "./dbConfig.js"
import { authenticateToken } from './middleware/authMiddleware.js';

const router = Router();

interface AuthenticatedRequest extends Request {
  user?: { user_id: string; iat: number; exp: number; };
}

const countProjectsByStatus = (status: number, user_id: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const query = "SELECT count(project_status) AS count FROM Project WHERE project_status = ? AND user_id = ?";
    pool.query(query, [status, user_id], (err, results: RowDataPacket[]) => {
      if (err) {
        return reject('프로젝트 상태별 수를 가져오는 데 실패했습니다.');
      }
      const count = results[0].count;
      resolve(count);
    });
  });
};

//진행 중인 프로젝트 수
router.get('/ProjectProgress', authenticateToken, async(req: Request, res: Response)=>{
  try{
    const user_id = req.user?.user_id
    if (!user_id) {
      return res.status(400).send('유효하지 않은 사용자입니다.');
    }
    console.log("user_id:", req.user?.user_id);
    const count = await countProjectsByStatus(1, user_id);
    res.send(count.toString());
    console.log("count: ", count);
  } catch(err){
    console.error(err);
    res.status(500).send('진행 중인 프로젝트 수 가져오기 성공');
  }
});

//대기 중인 프로젝트 수
router.get('/ProjectWait', authenticateToken, async(req: Request, res: Response)=>{
  try{
    const user_id = req.user?.user_id
    if (!user_id) {
      return res.status(400).send('유효하지 않은 사용자입니다.');
    }
    const count = await countProjectsByStatus(2, user_id);
    res.send(count.toString());
    console.log("count: ", count);
  } catch(err){
    console.error(err);
    res.status(500).send('진행 중인 프로젝트 수 가져오기 성공');
  }
});

//완료된 프로젝트 수
router.get('/ProjectComplete', authenticateToken, async(req: Request, res: Response)=>{
  try{
    const user_id = req.user?.user_id
    if (!user_id) {
      return res.status(400).send('유효하지 않은 사용자입니다.');
    }
    const count = await countProjectsByStatus(3, user_id);
    res.send(count.toString());
    console.log("count: ", count);
  } catch(err){
    console.error(err);
    res.status(500).send('진행 중인 프로젝트 수 가져오기 성공');
  }
});

//유저의 프로젝트 리스트
router.get('/ProjectData', authenticateToken, async(req: Request, res: Response) => {

  const user_id = req.user?.user_id!;

  console.log("프로젝트 리스트 userId : ", user_id);

  if (!user_id) {
    console.error('유저 ID가 존재하지 않습니다.');
    return res.status(400).send('유저 ID가 존재하지 않습니다.');
  }

  const query = "select project_id, project_title, project_details, project_status, project_type, project_endDate from Project where user_id = ?";

  pool.query(query, [user_id], (err, results: RowDataPacket[]) => {
    if(err) {
      console.error('유저의 프로젝트 정보를 가져오는 데 실패했습니다.', err);
      return res.status(500).send('프로젝트 정보 가져오기 실패');
    }

    results.forEach((project) => {
      project.project_endDate = new Date(project.project_endDate).toLocaleDateString("en-CA");
      project.project_status = project.project_status == "1" ? "진행중" : project.project_status == "2" ? "대기" : project.project_status == "3" ? "완료" : "";
      project.project_type = project.project_type == "4" ? "프로젝트" : project.project_type == "5" ? "발표" : project.project_type == "6" ? "보고서" : "";
    });
    res.json(results);
  });

  console.log('프로젝트 가져오기 성공');
});

// 이번 달 일정 조회
router.get(
  "/Monthly",
  authenticateToken,
  (req: AuthenticatedRequest, res: Response) => {
    const { user_id } = req.user!;

    const query = `
    SELECT 
      schedule_id AS id,
      schedule_title AS title,
      DATE_FORMAT(schedule_startDate, '%y.%m.%d') AS startDate,
      DATE_FORMAT(schedule_endDate, '%y.%m.%d') AS endDate
    FROM Schedules
    WHERE user_id = ? 
    AND MONTH(schedule_startDate) = MONTH(CURDATE()) 
    AND YEAR(schedule_startDate) = YEAR(CURDATE())
    ORDER BY schedule_startDate ASC;
  `;

    pool.query<RowDataPacket[]>(query, [user_id], (error, results) => {
      if (error) {
        console.error("이번 달 일정 조회 오류:", error);
        return res.status(500).json({ success: false, message: "서버 오류" });
      }
      res.status(200).json({ success: true, data: results });
    });
  }
);

export default router;