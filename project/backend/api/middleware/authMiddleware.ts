import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// 사용자 정의 토큰 타입
interface DecodedToken extends JwtPayload {
  user_id: string;
    iat: number;
    exp: number;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ message: '인증 토큰이 필요합니다.' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as DecodedToken;

    if (!decoded.user_id) {
      return res.status(403).json({ message: '유효하지 않은 토큰 구조입니다.' });
    }

    req.user = {
      user_id: decoded.user_id,
      iat: decoded.iat,
      exp: decoded.exp,
    };

    next();
  } catch (err) {
    console.error('토큰 검증 실패:', err);
    return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
  }
};
