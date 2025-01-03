import { RowDataPacket, createPool } from "mysql2";
import pool from "./dbConfig.js";

// 공통 common_id 조회 함수
export const getCommonId = (commonDetail: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT common_id FROM Common WHERE common_detail = ?';
    pool.query(query, [commonDetail], (err, results: RowDataPacket[]) => {
      if (err) {
        return reject(err);
      }
      if (results.length > 0) {
        return resolve(results[0].common_id);
      } else {
        return reject(new Error("common_id를 찾을 수 없습니다."));
      }
    });
  });
};

