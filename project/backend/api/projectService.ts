// 프로젝트 관련 API 서비스
import { config } from 'dotenv';
config();  // 환경 변수 로드
import { Request, Response, Router } from "express";
import { createPool, RowDataPacket } from "mysql2";
import { getCommonId, formatDateToNumber } from "./dbUtils.js";

const router = Router();

// MySQL 연결 설정
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

// MySQL 연결 풀 생성
const pool = createPool(dbConfig);


//AWS RDS 연결
pool.getConnection((err, connection) => {
  //DB 연결 실패
  if(err){
    console.error('DB 연결 실패', err);
    return;
  }
  //DB 연결 성공
  console.log('DB 연결 성공');
  connection.release(); //pool에 connection 반환
})

//Common 테이블에서 프로젝트 상태 데이터 가져오기
router.get('/api/commonStatus', (req: Request,res: Response) => {
  const query = "select common_detail from Common where common_id IN (1,2,3)";
  pool.query(query, (err, results) => {
    if(err){
      console.log('프로젝트 상태 데이터 가져오기 실패');
      return res.status(500).send('프로젝트 상태 데이터 가져오기 실패');
    }

    res.json(results);
  });

  console.log('프로젝트 상태 데이터 가져오기 성공');
});

//Common 테이블에서 프로젝트 타입 데이터 가져오기
router.get('/api/commonType', (req: Request,res: Response) => {
  const query = "select common_detail from Common where common_id IN (4,5,6)";
  pool.query(query, (err, results) => {
    if(err){
      console.log('프로젝트 타입 데이터 가져오기 실패');
      return res.status(500).send('프로젝트 타입 데이터 가져오기 실패');
    }

    res.json(results);
  });

  console.log('프로젝트 타입 데이터 가져오기 성공');
});

//프로젝트 추가 API
router.post('/api/projectService', async(req,res)=>{
  console.log(req.body);
  const {importance, status, type, title, startDate, endDate, manager, description} = req.body;
  console.log(typeof startDate);
  console.log(startDate);

  const importanceNumber = Number(importance);
  console.log("importanceNumber: ",importanceNumber);

  try {
    const formattedStartDate = formatDateToNumber(new Date(startDate));
    const formattedEndDate = formatDateToNumber(new Date(endDate));
    const statusCommonId = await getCommonId(status);
    const typeCommonId = await getCommonId(type);

    console.log("statusCommonId :",statusCommonId);
    console.log("typeCommonId : ",typeCommonId);

    //DB에 insert 쿼리 날리기
    const query = `
      INSERT INTO Project (
        user_id, project_status, project_type, project_title,
        project_details, project_rank, project_startDate,
        project_endDate, project_manager
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      "user123", statusCommonId, typeCommonId, title,
      description, importanceNumber, formattedStartDate,
      formattedEndDate, manager
    ];

    console.log("실행된 쿼리: ", query, values);

    pool.query(query, values, (err) => {
      if(err){
        return res.status(500).send('프로젝트 추가 실패: 데이터베이스 오류');
      }
      res.status(200).send('프로젝트 추가 성공');
    });
  } catch(err){
    console.log(err);
    res.status(500).send('프로젝트 추가 실패');
  }

});

//프로젝트 수정 - 데이터 가져오기
router.get('/api/projectService/:projectId', async(req: Request, res:Response) => {
  const projectId = req.params.projectId;
  console.log("프로젝트 수정: ",projectId);
  const query = 'select project_rank, project_type, project_status, project_title, project_startDate, project_endDate, project_manager, project_details from Project where project_id = ?';

  pool.query(query, [projectId], (err, results:RowDataPacket[]) => {
    if (err) {
      console.error('프로젝트 데이터를 가져오는 데 실패했습니다.', err);
      return res.status(500).send('프로젝트 데이터를 가져오는 데 실패했습니다.');
    }

    if (results.length === 0) {
      return res.status(404).send('프로젝트를 찾을 수 없습니다.');
    }

    const project = results[0];  // 결과에서 첫 번째 프로젝트 데이터만 사용

    // // 프로젝트 상태 및 중요도 변환
    const importance = project.project_rank;

    const status = project.project_status === 1 ? '진행중' :
                   project.project_status === 2 ? '대기' : '완료';

    // 프로젝트 타입
    const type = project.project_type === 4 ? '프로젝트' :
                 project.project_type === 5 ? '발표' : '보고서';

    // 날짜 형식 변환
    const formattedStartDate = new Date(project.project_startDate).toLocaleDateString('en-CA');
    const formattedEndDate = new Date(project.project_endDate).toLocaleDateString('en-CA');

    // 프로젝트 데이터 반환
    res.json({
      importance,
      status,
      type,
      title: project.project_title,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      manager: project.project_manager || '',
      description: project.project_details || '',
    });
    console.log("results[0]:",results[0]);
  })
})

//프로젝트 수정 - 수정
router.put('/api/projectService/:projectId', async(req: Request, res:Response) => {
  console.log("프로젝트 수정 요청: ", req.body);
  const projectId = req.params.projectId;
  const {importance, status, type, title, startDate, endDate, manager, description} = req.body;
  const project_startDate = new Date(startDate).toISOString().slice(0, 10);
  const project_endDate = new Date(endDate).toISOString().slice(0, 10);

  try {
    const statusCommonId = await getCommonId(status);
    const typeCommonId = await getCommonId(type);
    const project_id = Number(projectId)

    //DB에 update 쿼리 날리기
    const query = 
        `update Project
            set project_rank = ?, project_status = ?, project_type = ?, project_title = ?, project_startDate = ?, project_endDate = ?, project_manager = ?, project_details = ?
            where project_id = ?`;
    const values = [
      importance, statusCommonId, typeCommonId, title, project_startDate, project_endDate, manager, description, project_id
    ];

    console.log("실행된 쿼리: ", query, values);

    pool.query(query, values, (err) => {
      if(err){
        return res.status(500).send('프로젝트 수정 실패: 데이터베이스 오류');
      }
      res.status(200).send('프로젝트 수정 성공');
    });
  } catch(err){
    console.log(err);
    res.status(500).send('프로젝트 수정 실패');
  }
})

export default router;