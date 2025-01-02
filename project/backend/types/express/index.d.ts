import { Express } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        user_id: string;
        iat: number;
        exp: number;
      };
    }
  }
}

declare namespace Express {
  export interface Request {
    user?: {
      user_id: string;
      iat: number;
      exp: number;
    };
  }
}
