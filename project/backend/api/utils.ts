// 날짜 포맷 함수 (YYYYMMDD 형태로 변환)
export const formatDateToNumber = (date: Date): number => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return Number(`${year}${month}${day}`);
};