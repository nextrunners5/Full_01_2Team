// 프로젝트 관련 API 서비스
import { config } from 'dotenv';
config();  // 환경 변수 로드
import { Request, Response, Router } from "express";
import { createPool, RowDataPacket } from "mysql2";
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

////Project 테이블에서 project_status 별 갯수 계산하기
//총 프로젝트 수
router.get('/ProjectAll', authenticateToken, async(req: Request, res: Response)=>{
  const {user_id} = req.user!;
  console.log("user_id:", user_id);

  const query = "select count(project_status) as count from Project where user_id = ?";
  pool.query(query, [user_id], (err, results) => {
    if(err){
      console.log('총 프로젝트 수 가져오기 실패');
      return res.status(500).send('총 프로젝트 수 가져오기 실패');
    }
    
    const rows = results as RowDataPacket[];
    console.log(rows);
    const count = rows[0].count;
    res.send(count.toString());
    console.log(count);
  
  });

  console.log('총 프로젝트 수 데이터 가져오기 성공');
});

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
  // const user_id = '1234';
  // const userId = req.params.userId;

  const user_id = req.user?.user_id!;
  // const user_id = req.query.user_id as string;
  console.log("프로젝트 리스트 userId : ", user_id);

  if (!user_id) {
    console.error('유저 ID가 존재하지 않습니다.');
    return res.status(400).send('유저 ID가 존재하지 않습니다.');
  }

  const query = "select project_id, project_title, project_details, project_status, project_endDate from Project where user_id = ?";

  pool.query(query, [user_id], (err, results: RowDataPacket[]) => {
    if(err) {
      console.error('유저의 프로젝트 정보를 가져오는 데 실패했습니다.', err);
      return res.status(500).send('프로젝트 정보 가져오기 실패');
    }

    results.forEach((project) => {
      project.project_endDate = new Date(project.project_endDate).toLocaleDateString("en-CA");
      project.project_status = project.project_status == "1" ? "진행중" : project.project_status == "2" ? "대기" : "완료";
    });
    res.json(results);
  });

  console.log('프로젝트 가져오기 성공');
});

// 우선순위가 1순위인 프로젝트 상위 5개 가져오기
router.get('/ImportanceProject', authenticateToken, (req: Request, res: Response) => {
  const user_id = req.user?.user_id;
  console.log("우선순위 user_id : ", user_id);
  const query = "select project_title, project_endDate from Project where user_id = ? and project_rank = 1 order by project_rank limit 5";
  pool.query(query, [user_id],(err, results: RowDataPacket[]) => {
    if(err) {
      console.error("프로젝트 우선순위에 따른 데이터를 가져오지 못했습니다.",err);
      return res.status(500).send('우선순위가 높은 프로젝트 가져오기 실패');
    }
    if(results.length > 0){
      for(let i = 0; i < results.length; i++){
        const projectEndDate = new Date(results[i].project_endDate);
        projectEndDate.setDate(projectEndDate.getDate() + 1);
        results[i].project_endDate = projectEndDate.toISOString().slice(0,10);
        console.log("중요도 날짜:",results[i].project_endDate);
      }
    }
    res.json(results);
  });

  console.log('우선순위가 높은 프로젝트 가져오기 성공');
});

//상태값 별 프로젝트 가져오기
router.get('/ProjectData/:statusName', authenticateToken, async (req: Request,res: Response) => {
  const project_status = req.params.statusName;
  const user_id = req.user?.user_id!;
  // const query = "select project_id, project_title, project_details, project_status, project_endDate from Project where project_status = ?";
  console.log(project_status);

  const getCommonId = (commonDetail: string): Promise<number> => {
    return new Promise((resolve, reject) => {
      console.log("commonDetail: ", commonDetail); 

      const query = 'select common_id from Common where common_detail = ?';
      pool.query(query, [commonDetail], (err, results: RowDataPacket[]) => {
        if(err){
          return reject(err);
        }
        console.log("쿼리 결과: ", results);  // 디버깅 추가
        if(results.length > 0){
          return resolve(results[0].common_id)
        } else {
          // return reject(new Error("common_id를 찾을 수 없습니다."));
          const query = "select project_id, project_title, project_details, project_status, project_endDate from Project where user_id = ?";
          pool.query(query, [user_id], (err, results: RowDataPacket[]) => {
            if(err) {
              console.error('유저의 프로젝트 정보를 가져오는 데 실패했습니다.', err);
              return res.status(500).send('프로젝트 정보 가져오기 실패');
            }
      
            if(results.length > 0){
              results.forEach((project) => {
                project.project_endDate = new Date(project.project_endDate).toLocaleDateString("en-CA");
                project.project_status = project.project_status == "1" ? "진행중" : project.project_status == "2" ? "대기" : "완료";
              });
            }
            res.json(results);
          });
        }
      });
    });
  };

  try {
    const statusCommonId = await getCommonId(project_status);

    //DB에 select 쿼리 날리기
    const query = "select project_id, project_title, project_details, project_status, project_endDate from Project where user_id = ? and project_status = ?";
    pool.query(query, [user_id, statusCommonId], (err,results: RowDataPacket[]) => {
      if(err){
        console.log("쿼리 결과: ", results);
        return res.status(500).send('선택된 상태 일정 값 보여주기 실패');
      }
      if(results.length > 0){
        results.forEach((project) => {
          project.project_endDate = new Date(project.project_endDate).toLocaleDateString("en-CA");
          project.project_status = project.project_status == "1" ? "진행중" : project.project_status == "2" ? "대기" : "완료";
        });
      }
      res.status(200).json(results);
    });
  } catch(err){
    console.log(err);
    res.status(500).send('선택된 상태 일정 값 보여주기 실패');
  }
});

//프로젝트 삭제
router.delete('/ProjectDelete/:projectId', authenticateToken,(req: Request, res: Response) => {
  const {projectId} = req.params;
  // const {userId} = req.body;
  const user_id = req.user?.user_id;
  // const {user_id} = req.user!;
  console.log("삭제 요청 user_id:",user_id);
  console.log("삭제요청 projectId:", projectId);
  const query = "delete from Project where project_id = ? and user_id = ?";

  pool.query(query, [projectId, user_id], (err, results) => {
    if(err) {
      console.error('프로젝트 삭제 실패', err);
      return res.status(500).send('프로젝트 삭제 실패');
    }
    console.log("delete results: ",results);
    res.json(results);
  });
  console.log('프로젝트 삭제 성공');
});

export default router;

