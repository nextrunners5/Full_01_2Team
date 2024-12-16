// 프로젝트 관련 API 서비스
// 프로젝트 관련 API 서비스
import express, { Request, Response } from "express";
import mysql, { RowDataPacket } from "mysql2";
import cors from "cors";

const app = express();
const port = 3300;

app.use(express.json());
app.use(cors());

//get
//put
//post
//delete

//JSON 통신 설정
app.use(express.json());
const pool = mysql.createPool({
  //앤드포인트
  host: "oz-full-team2.cjsawigiiycp.ap-northeast-2.rds.amazonaws.com",

  //사용자명
  user: "admin",

  //비밀번호
  password: "oz-full-Team2",

  //데이터베이스명
  database: "oz_full_Team2",

  //데이터베이스포트번호
  port: 3306,
});

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

//기본 라우트
app.get("/", (req, res) => {
  res.send("Hello, TypeScript API!");
});

// // 데이터 가져오기 API
// app.get("/api/data", (req: Request, res: Response) => {
//   const data = { id: 1, name: "Sample Data" };
//   res.json(data);
// });

//Common 테이블에서 프로젝트 상태 데이터 가져오기
app.get('/api/commonStatus', (req: Request,res: Response) => {
  const query = "select common_detail from Common where common_id IN (1,2,3)";
  pool.query(query, (err, results) => {
    if(err){
      console.log('데이터 가져오기 실패');
      return res.status(500).send('데이터 가져오기 실패');
    }

    res.json(results);
  });

  console.log('데이터 가져오기 성공');
});

//Common 테이블에서 프로젝트 타입 데이터 가져오기
app.get('/api/commonType', (req: Request,res: Response) => {
  const query = "select common_detail from Common where common_id IN (4,5,6)";
  pool.query(query, (err, results) => {
    if(err){
      console.log('데이터 가져오기 실패');
      return res.status(500).send('데이터 가져오기 실패');
    }

    res.json(results);
  });

  console.log('데이터 가져오기 성공');
});

//프로젝트 추가 API
app.post('/api/projectService', async(req,res)=>{
  console.log(req.body);
  const {importance, status, type, title, startDate, endDate, manager, description} = req.body;
  console.log(typeof startDate);
  console.log(startDate);

  const strArr = new Date(startDate);

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

  const endArr = new Date(endDate);

  dateArr[0] = endArr.getFullYear();
  dateArr[1] = endArr.getMonth()+1;
  dateArr[2] = endArr.getDate();

  const formattedEndDate = formatDateToNumber(dateArr);
  console.log(formattedEndDate);
  console.log(typeof formattedEndDate);


  const getCommonId = (commonDetail: string): Promise<number> => {
    return new Promise((resolve, reject) => {
      const query = 'select common_id from Common where common_detail = ?';
      pool.query(query, [commonDetail], (err, results: RowDataPacket[]) => {
        if(err){
          return reject(err);
        }
        if(results.length > 0){
          return resolve(results[0].common_id)
        } else {
          return reject(new Error("common_id를 찾을 수 없습니다."));
        }
      });
    });
  };

  try {
    const statusCommonId = await getCommonId(status);
    const typeCommonId = await getCommonId(type);

    console.log(statusCommonId);
    console.log(typeCommonId);

    //DB에 insert 쿼리 날리기
    const query = "insert into Project (user_id,project_status,project_type,project_title,project_details,project_rank,project_startDate,project_endDate) values(?,?,?,?,?,?,?,?)";
    const values = ['user123',statusCommonId,typeCommonId,title,description,importance,formattedStartDate,formattedEndDate];

    pool.query(query, values, (err) => {
      if(err){
        return res.status(500).send('프로젝트 추가 실패');
      }
      res.status(200).send('프로젝트 추가 성공');
    });
  } catch(err){
    console.log(err);
    res.status(500).send('프로젝트 추가 실패');
  }
  

});

// 서버 시작
app.listen(port, () => {
  console.log(`서버 시작 중...${port}`);
});