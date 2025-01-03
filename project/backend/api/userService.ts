import { config } from 'dotenv';
config();  // 환경 변수 로드
import { Router, Request, Response } from 'express';
import { createPool, RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import jwt from 'jsonwebtoken';
import { authenticateToken} from './middleware/authMiddleware.js';

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

// JWT 시크릿 키 (환경 변수에서 가져오기)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// 회원가입 API
interface RegisterBody {
  user_id: string;
  user_pw: string;
  user_pw_confirm: string;
  user_name: string;
  user_email: string;
}

router.post('/register', async (req: Request<{}, {}, RegisterBody>, res: Response) => {
  const { user_id, user_pw, user_pw_confirm, user_name, user_email } = req.body;

  if (!user_id || !user_pw || !user_pw_confirm || !user_name || !user_email) {
    return res.status(400).json({ success: false, message: '모든 필드를 입력해주세요.' });
  }

  if (user_pw !== user_pw_confirm) {
    return res.status(400).json({ success: false, message: '비밀번호가 일치하지 않습니다.' });
  }

  try {
    const query = `
      INSERT INTO User (user_id, user_pw, user_pw_confirm, user_name, user_email, create_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;

    const [result] = await pool.execute<ResultSetHeader>(query, [
      user_id,
      user_pw,
      user_pw_confirm,
      user_name,
      user_email,
    ]);

    res.status(201).json({ success: true, message: '회원가입이 완료되었습니다.' });
  } catch (error: any) {
    console.error('회원가입 오류:', error.message || error);
    res.status(500).json({ success: false, message: '서버 오류 발생', error: error.message });
  }
});

// 아이디 중복 확인 API
router.post('/check-username', async (req: Request, res: Response) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ success: false, message: '아이디를 입력해주세요.' });
  }

  try {
    const query = `SELECT COUNT(*) AS count FROM User WHERE user_id = ?`;
    const [rows] = await pool.execute<RowDataPacket[]>(query, [username]);

    const count = rows[0].count || 0;

    if (count > 0) {
      return res.status(400).json({ success: false, message: '이미 존재하는 아이디입니다.' });
    }

    res.status(200).json({ success: true, message: '사용 가능한 아이디입니다.' });
  } catch (error: any) {
    console.error('아이디 중복 확인 오류:', error.message || error);
    res.status(500).json({ success: false, message: '서버 오류 발생', error: error.message });
  }
});

// 로그인 API
interface LoginBody {
  user_id: string;
  user_pw: string;
}

router.post('/login', async (req: Request<{}, {}, LoginBody>, res: Response) => {
  const { user_id, user_pw } = req.body;

  if (!user_id || !user_pw) {
    return res.status(400).json({ success: false, message: '아이디와 비밀번호를 입력해주세요.' });
  }

  try {
    const query = `SELECT * FROM User WHERE user_id = ? AND user_pw = ?`;
    const [rows] = await pool.execute<RowDataPacket[]>(query, [user_id, user_pw]);

    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: '아이디 또는 비밀번호가 일치하지 않습니다.' });
    }

    // JWT 토큰 발급
    const token = jwt.sign({ user_id }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });

    res.status(200).json({ success: true, message: '로그인 성공!', token });
  } catch (error: any) {
    console.error('로그인 오류:', error.message || error);
    res.status(500).json({ success: false, message: '서버 오류 발생', error: error.message });
  }
});

// 보호된 경로 예제 (토큰 검증)
router.get('/protected', authenticateToken, (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: '인증된 사용자입니다.', user: (req as any).user });
});

// 사용자 정보 가져오기 API
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ message: '사용자 정보가 없습니다.' });
  }

  try {
    const { user_id } = req.user;
    const query = `
      SELECT user_id, user_name, user_email, profile_img, DATE_FORMAT(create_at, '%Y-%m-%d') AS create_at 
      FROM User WHERE user_id = ?
    `;
    const [rows] = await pool.execute<RowDataPacket[]>(query, [user_id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
    }

    const user = rows[0];
    res.json({
      success: true,
      user: {
        user_id: user.user_id,
        user_name: user.user_name,
        user_email: user.user_email,
        profile_img: user.profile_img,
        create_at: user.create_at,
      },
    });
  } catch (error: any) {
    console.error('사용자 정보 조회 오류:', error.message || error);
    res.status(500).json({ message: '서버 오류 발생', error: error.message });
  }
});

// 마이페이지 업데이트 API
router.put('/update', authenticateToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.user_id;
    const { user_name, user_email, current_password, new_password, profile_img } = req.body;

    const [rows] = await pool.execute<RowDataPacket[]>(
      'SELECT user_pw FROM User WHERE user_id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: '사용자를 찾을 수 없습니다.' });
    }

    if (rows[0].user_pw !== current_password) {
      return res.status(400).json({ success: false, message: '현재 비밀번호가 일치하지 않습니다.' });
    }

    // 사용자 정보 업데이트
    const passwordToUpdate = new_password || current_password;

    const updateQuery = `
    UPDATE User 
    SET user_name = ?, user_email = ?, user_pw = ?, profile_img = COALESCE(?, profile_img)
    WHERE user_id = ?
    `;
    await pool.execute(updateQuery, [user_name, user_email, passwordToUpdate, profile_img || null, userId]);
  

    res.status(200).json({
      success: true,
      message: '사용자 정보가 성공적으로 업데이트되었습니다.',
      user: {
        user_name,
        user_email,
        profile_img,
      },
    });
  } catch (error: any) {
    console.error('사용자 정보 업데이트 오류:', error.message || error);
    res.status(500).json({ success: false, message: '서버 오류 발생' });
  }
});

router.delete('/delete', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user || !req.user.user_id) {
      return res.status(401).json({ success: false, message: '인증 정보가 없습니다.' });
    }

    const { user_id } = req.user;

    // 트랜잭션 시작
    const connection = await pool.getConnection();
    await connection.beginTransaction();

    try {
      await connection.query(`DELETE FROM Schedules WHERE user_id = ?`, [user_id]);

      const [result] = await connection.query(`DELETE FROM User WHERE user_id = ?`, [user_id]);

      if ((result as any).affectedRows === 0) {
        throw new Error('해당 사용자를 찾을 수 없습니다.');
      }

      // 트랜잭션 커밋
      await connection.commit();
      connection.release();

      return res.status(200).json({ success: true, message: '회원 탈퇴가 완료되었습니다.' });
    } catch (error: any) {
      await connection.rollback();
      connection.release();
      console.error('회원 탈퇴 중 오류:', error.message);
      return res.status(500).json({ success: false, message: '회원 탈퇴 중 오류 발생', error: error.message });
    }
  } catch (error: any) {
    console.error('회원 탈퇴 API 오류:', error.message);
    return res.status(500).json({ success: false, message: '서버 오류가 발생했습니다.', error: error.message });
  }
});

export default router;
