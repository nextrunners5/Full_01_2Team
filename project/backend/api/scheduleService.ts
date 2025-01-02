import { Router, Request, Response } from 'express';
import { createPool, ResultSetHeader } from 'mysql2';
import { authenticateToken } from './middleware/authMiddleware.js';

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

// MySQL 연결 테스트
pool.getConnection((err, connection) => {
  if (err) {
    console.error('MySQL 데이터베이스 연결 실패:', err);
    process.exit(1);
  } else {
    console.log('MySQL 데이터베이스 연결 성공');
    connection.release();
  }
});

// 유저 ID 타입 정의
interface AuthenticatedRequest extends Request {
  user?: { user_id: string; iat: number; exp: number; };
}

// ✅ **1. 일정 저장 API (POST)**
router.post('/', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { user_id } = req.user!;
  const { startDate, endDate, startTime, endTime, title, description } = req.body;

  const query = `
    INSERT INTO Schedules (
      user_id,
      schedule_startDate,
      schedule_endDate,
      schedule_startTime,
      schedule_endTime,
      schedule_title,
      schedule_details
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  pool.query<ResultSetHeader>(
    query,
    [user_id, startDate, endDate, startTime, endTime, title, description],
    (error, results) => {
      if (error) {
        console.error('일정 저장 오류:', error);
        res.status(500).json({ success: false, message: '서버 오류', error: error.message });
      } else {
        res.status(201).json({ success: true, message: '일정이 저장되었습니다.', data: results.insertId });
      }
    }
  );
});

// ✅ **2. 일정 조회 API (GET)**
router.get('/', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { user_id } = req.user!;

  const query = `
    SELECT 
      schedule_id AS id,
      schedule_title AS title,
      schedule_startDate AS startDate,
      schedule_endDate AS endDate,
      schedule_startTime AS startTime,
      schedule_endTime AS endTime,
      schedule_details AS description
    FROM Schedules
    WHERE user_id = ?
  `;

  pool.query(query, [user_id], (error, results) => {
    if (error) {
      console.error('일정 조회 오류:', error);
      res.status(500).json({ success: false, message: '서버 오류' });
    } else {
      res.status(200).json({ success: true, data: results });
    }
  });
});

// ✅ **3. 일정 수정 API (PUT)**
router.put('/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { user_id } = req.user!;
  const { id } = req.params;
  const { startDate, endDate, startTime, endTime, title, description } = req.body;

  const query = `
    UPDATE Schedules
    SET 
      schedule_startDate = ?, 
      schedule_endDate = ?, 
      schedule_startTime = ?, 
      schedule_endTime = ?, 
      schedule_title = ?, 
      schedule_details = ?
    WHERE schedule_id = ? AND user_id = ?
  `;

  pool.query<ResultSetHeader>(
    query,
    [startDate, endDate, startTime, endTime, title, description, id, user_id],
    (error, results) => {
      if (error) {
        console.error('일정 수정 오류:', error);
        res.status(500).json({ success: false, message: '일정 수정 중 오류 발생', error: error.message });
      } else if (results.affectedRows === 0) {
        res.status(404).json({ success: false, message: '해당 ID의 일정이 존재하지 않거나 권한이 없습니다.' });
      } else {
        res.status(200).json({ success: true, message: '일정이 성공적으로 수정되었습니다.' });
      }
    }
  );
});

// ✅ **4. 일정 삭제 API (DELETE)**
router.delete('/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { user_id } = req.user!;
  const { id } = req.params;

  const query = `
    DELETE FROM Schedules WHERE schedule_id = ? AND user_id = ?
  `;

  pool.query<ResultSetHeader>(query, [id, user_id], (error, results) => {
    if (error) {
      console.error('일정 삭제 오류:', error);
      res.status(500).json({ success: false, message: '일정 삭제 중 오류 발생', error: error.message });
    } else if (results.affectedRows === 0) {
      res.status(404).json({ success: false, message: '해당 ID의 일정이 존재하지 않거나 권한이 없습니다.' });
    } else {
      res.status(200).json({ success: true, message: '일정이 성공적으로 삭제되었습니다.' });
    }
  });
});

// ✅ **5. 일주일간의 일정 조회 API (GET)**
router.get('/upcoming', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { user_id } = req.user!;

  const query = `
    SELECT 
      schedule_id AS id,
      schedule_title AS title,
      schedule_startDate AS startDate,
      schedule_endDate AS endDate,
      schedule_startTime AS startTime,
      schedule_endTime AS endTime,
      schedule_details AS description
    FROM Schedules
    WHERE user_id = ? AND schedule_startDate BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
    ORDER BY schedule_startDate ASC;
  `;

  pool.query(query, [user_id], (error, results) => {
    if (error) {
      console.error('일주일 일정 조회 오류:', error);
      res.status(500).json({ success: false, message: '서버 오류' });
    } else {
      res.status(200).json({ success: true, data: results });
    }
  });
});

export default router;
