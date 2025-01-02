// 프로젝트 관련 API 서비스
import { config } from 'dotenv';
config();  // 환경 변수 로드
import { Request, Response, Router } from "express";
import { createPool, RowDataPacket } from "mysql2";

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

const countProjectsByStatus = (status: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    const query = "SELECT count(project_status) AS count FROM Project WHERE project_status = ?";
    pool.query(query, [status], (err, results: RowDataPacket[]) => {
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
router.get('/api/ProjectDashBoard/ProjectAll', async(req: Request, res: Response)=>{
  const query = "select count(project_status) as count from Project";
  pool.query(query, (err, results) => {
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
router.get('/api/ProjectDashBoard/ProjectProgress', async(req: Request, res: Response)=>{
  try{
    const count = await countProjectsByStatus(1);
    res.send(count.toString());
    console.log("count: ", count);
  } catch(err){
    console.error(err);
    res.status(500).send('진행 중인 프로젝트 수 가져오기 성공');
  }
});

//대기 중인 프로젝트 수
router.get('/api/ProjectDashBoard/ProjectWait', async(req: Request, res: Response)=>{
  try{
    const count = await countProjectsByStatus(2);
    res.send(count.toString());
    console.log("count: ", count);
  } catch(err){
    console.error(err);
    res.status(500).send('진행 중인 프로젝트 수 가져오기 성공');
  }
});

//완료된 프로젝트 수
router.get('/api/ProjectDashBoard/ProjectComplete', async(req: Request, res: Response)=>{
  try{
    const count = await countProjectsByStatus(3);
    res.send(count.toString());
    console.log("count: ", count);
  } catch(err){
    console.error(err);
    res.status(500).send('진행 중인 프로젝트 수 가져오기 성공');
  }
});

//유저의 프로젝트 리스트
router.get('/api/ProjectDashBoard/ProjectData', async(req: Request, res: Response) => {
  const userId = 'user123';
  const query = "select project_id, project_title, project_details, project_status, project_endDate from Project where user_id = ?";

  pool.query(query, [userId], (err, results: RowDataPacket[]) => {
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
router.get('/api/ProjectDashBoard/ImportanceProject', (req: Request, res: Response) => {
  const query = "select project_title, project_endDate from Project where project_rank = 1 order by project_rank limit 5";
  pool.query(query, (err, results: RowDataPacket[]) => {
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
router.get('/api/ProjectDashBoard/ProjectData/:statusName', async (req: Request,res: Response) => {
  const project_status = req.params.statusName;
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
          const query = "select project_id, project_title, project_details, project_status, project_endDate from Project";
          pool.query(query, (err, results: RowDataPacket[]) => {
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
    const query = "select project_id, project_title, project_details, project_status, project_endDate from Project where project_status = ?";
    pool.query(query, [statusCommonId], (err,results: RowDataPacket[]) => {
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
router.delete('/api/ProjectDashBoard/ProjectService/:projectId', (req: Request, res: Response) => {
  const {projectId} = req.params;
  console.log("삭제요청 projectId:", projectId);
  const query = "delete from Project where project_id = ?";
  console.log(query);

  pool.query(query, [projectId], (err, results) => {
    if(err) {
      console.error('프로젝트 삭제 실패', err);
      return res.status(500).send('프로젝트 삭제 실패');
    }
    
    res.json(results);
  });
  console.log('프로젝트 삭제 성공');
});

export default router;

