import { config } from 'dotenv';
config();  // 환경 변수 로드
import { RowDataPacket } from "mysql2";
import { Request, Response, Router } from "express";
import pool from "./dbConfig.js"
import { getCommonId } from "./dbUtils.js";

const router = Router();

//Common 테이블에서 프로젝트 상태 값 가져오기
router.get('/api/tasks/Status', (req: Request, res: Response ) => {
  const query = "select common_detail from Common where common_id IN (1,2,3)";

  pool.query(query, (err, result) => {
    if(err) {
      console.log('상태 데이터 가져오기 실패');
      return res.status(500).send('상태 데이터 가져오기 실패');
    }
    res.json(result);
  });
  console.log('상태 데이터 가져오기 성공');
});

//데이터베이스에 저장된 프로젝트 데이터 가져오기(제목, 중요도, 상태, 시작일, 종료일, 설명)
router.get('/api/tasks/ProjectEachDetails/:projectId', (req: Request, res: Response) => {
  const projectId = req.params.projectId;
  // const userId = 'user123';
  const query = "select project_id, project_title, project_details, project_status, project_rank, project_startDate, project_endDate from Project where project_id = ?";

  pool.query(query, [projectId], (err, results:RowDataPacket[]) => {
    if(err) {
      console.log('데이터 가져오기 실패', err);
      return res.status(500).send('데이터 가져오기 실패');
    }
    if(results.length > 0) {
      for(let i = 0; i < results.length; i++){
        const projectStartDate = new Date(results[i].project_startDate).toLocaleDateString('en-CA');
        results[i].project_startDate = projectStartDate;

        const projectEndDate = new Date(results[i].project_endDate).toLocaleDateString('en-CA');
        results[i].project_endDate = projectEndDate;

        if(results[i].project_status == '1'){
          results[i].project_status = "진행중";
        } else if(results[i].project_status == '2'){
          results[i].project_status = "대기";
        } else if(results[i].project_status == '3'){
          results[i].project_status = "완료";
        }

        if(results[i].project_rank == '1'){
          results[i].project_rank = "상";
        } else if (results[i].project_rank == '2'){
          results[i].project_rank = "중";
        } else if(results[i].project_rank == '3'){
          results[i].project_rank = "하";
        }
      }
    }
    console.log(results);
    res.json(results);
  });
  console.log('데이터 가져오기 성공');
  
});


//각 프로젝트 별 세부 내용 추가 API
router.post('/api/tasks', async (req: Request, res: Response) => {
  // const projectId = req.params.projectId;
  console.log(req.body);
  const {task_name, task_manager, task_startDate, task_endDate, task_status, project_id} = req.body;
  console.log("typeof:",typeof task_startDate);
  console.log(typeof project_id);
  console.log(req.body);
  console.log("status: ",task_status);

  const id = Number(project_id);

  const strArr = new Date(task_startDate);

  const dateArr:number[] = [];
  dateArr[0] = strArr.getFullYear();
  dateArr[1] = strArr.getMonth()+1;
  dateArr[2] = strArr.getDate();

  function formatDateToNumber(dateArr:number[]) {
    return Number(dateArr.map(num => `${num}`.padStart(2, '0')).join(''));
  }

  const formattedStartDate = formatDateToNumber(dateArr);
  console.log(formattedStartDate);
  console.log(typeof formattedStartDate);

  const endArr = new Date(task_endDate);

  dateArr[0] = endArr.getFullYear();
  dateArr[1] = endArr.getMonth()+1;
  dateArr[2] = endArr.getDate();

  const formattedEndDate = formatDateToNumber(dateArr);
  console.log(formattedEndDate);
  console.log(typeof formattedEndDate);

  try {
    const statusCommonId = await getCommonId(task_status);
    console.log(statusCommonId);

    //DB에 insert 쿼리 날리기
    const query = `
      INSERT INTO Project_taskList (
        project_id, task_name, task_startDate,
        task_endDate, task_status, task_manager
      ) VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
      id, task_name, formattedStartDate, formattedEndDate, statusCommonId, task_manager
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

//프로젝트 세부일정 추가 시 화면에 띄우기
router.get('/api/tasks/:projectId', (req: Request, res: Response) => {
  const projectId = req.params.projectId;
  const query = `select task_id, task_name, task_startDate, task_endDate, task_manager, task_status 
                  from Project_taskList 
                  where project_id = ?`;
  pool.query(query, [projectId], (err, results: RowDataPacket[]) => {
    if(err){
      console.log('세부 일정 가져오기 실패',err);
      return res.status(500).send('세부 일정 가져오기 실패');
    }

    console.log(results);

    if(results.length > 0){
      for(let i = 0; i < results.length; i++){
        const taskStartDate = new Date(results[i].task_startDate).toLocaleDateString('en-CA');
        const taskEndDate = new Date(results[i].task_endDate).toLocaleDateString('en-CA');
        results[i].task_startDate = taskStartDate;
        results[i].task_endDate = taskEndDate;

        if(results[i].task_status == '1'){
          results[i].task_status = "진행중";
        } else if(results[i].task_status == '2'){
          results[i].task_status = "대기";
        } else {
          results[i].task_status = "완료";
        }
      }
    }
    console.log("result:",results);
    res.json(results);
  });

  console.log('세부 일정 가져오기 성공');
});

//세부 일정 삭제
router.delete('/api/tasks/:taskId', (req: Request, res: Response) => {
  const {taskId} = req.params; 
  console.log(`삭제 요청 taskId: ${taskId}`);
  const query = 'delete from Project_taskList where task_id = ?';
  
  pool.query(query, [taskId],(err,results) => {
    if(err){
      console.error('세부 일정 삭제 실패', err);
      return res.status(500).send('세부 일정 삭제 실패');
    }
    res.json(results);
  });
  console.log('세부 일정 삭제 성공')
});

// 세부 일정 수정
router.put('/api/tasks/:taskId', async(req: Request, res: Response) => {
  console.log("수정 요청 값 :", req.body);
  const {task_id, task_name, task_startDate, task_endDate, task_manager, task_status} = req.body;
  // const {taskId} = req.params; 
  console.log(task_startDate);
  const startDate = new Date(task_startDate).toISOString().slice(0, 10);
  const endDate = new Date(task_endDate).toISOString().slice(0, 10);

  try {
    const statusCommonId = await getCommonId(task_status);

    console.log(statusCommonId);

    //DB에 update 쿼리 날리기
    const query = 
        `update Project_taskList 
            set task_name = ?, task_manager = ?, task_startDate = ?, task_endDate = ?, task_status = ?
            where task_id = ?`;
    const values = [
      task_name, task_manager, task_startDate, task_endDate, statusCommonId, task_id
    ];

    console.log("실행된 쿼리: ", query, values);

    pool.query(query, values, (err) => {
      if(err){
        return res.status(500).send('일정 수정 실패: 데이터베이스 오류');
      }
      res.status(200).send('일정 수정 성공');
    });
  } catch(err){
    console.log(err);
    res.status(500).send('일정 수정 실패');
  }

});

//필터링 검색
router.get('/api/tasks/filter/:projectId/:value', async(req: Request, res: Response) => {
  const common_id = req.params.value;
  const project_id = req.params.projectId;
  console.log("검색 body:", common_id);
  
  try {
    const statusCommonId = await getCommonId(common_id);

    //DB에 select 쿼리 날리기
    const query = 'select task_id, task_name, task_startDate, task_endDate, task_manager, task_status from Project_taskList where task_status = ? && project_id = ?';
    pool.query(query, [statusCommonId, project_id], (err,results: RowDataPacket[]) => {
      if(err){
        console.log("쿼리 결과: ", results);
        return res.status(500).send('선택된 상태 일정 값 보여주기 실패');
      }
      if(results.length > 0){
        for(let i = 0; i < results.length; i++){
          const taskStartDate = new Date(results[i].task_startDate).toLocaleDateString('en-CA');
          const taskEndDate = new Date(results[i].task_endDate).toLocaleDateString('en-CA');
          results[i].task_startDate = taskStartDate;
          results[i].task_endDate = taskEndDate;
  
          if(results[i].task_status == '1'){
            results[i].task_status = "진행중";
          } else if(results[i].task_status == '2'){
            results[i].task_status = "대기";
          } else {
            results[i].task_status = "완료";
          }
        }
      }
      res.status(200).json(results);
    });
  } catch(err){
    console.log(err);
    res.status(500).send('선택된 상태 일정 값 보여주기 실패');
  }
})
