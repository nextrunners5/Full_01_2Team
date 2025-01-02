import { RowDataPacket, createPool } from "mysql2";
// import { pool } from "./dbConfig";

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

const pool = createPool(dbConfig);

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

// 날짜 포맷 함수 (YYYYMMDD 형태로 변환)
export const formatDateToNumber = (date: Date): number => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return Number(`${year}${month}${day}`);
};
