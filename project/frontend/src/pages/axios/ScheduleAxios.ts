import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/Schedules";

/* 일정 저장 (POST) */
export const saveSchedule = async (scheduleData: {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
}) => {
  try {
    const response = await axios.post(API_BASE_URL, scheduleData);
    console.log("일정 저장 응답:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("일정 저장 중 오류 발생:", error.response?.data || error.message);
    throw new Error("일정을 저장하는 중 오류가 발생했습니다.");
  }
};

/* 일정 수정 (PUT) */
export const updateSchedule = async (id: string, scheduleData: {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
}) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, scheduleData);
    console.log("일정 수정 응답:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("일정 수정 중 오류 발생:", error.response?.data || error.message);
    throw new Error("일정을 수정하는 중 오류가 발생했습니다.");
  }
};

/* 일정 리스트 가져오기 (GET) */
export const fetchSchedules = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data.data;
  } catch (error: any) {
    console.error("일정 데이터 불러오기 실패:", error.response?.data || error.message);
    throw new Error("일정을 불러오는 중 오류가 발생했습니다.");
  }
};

/* 일정 삭제하기 (DELETE) */
export const deleteSchedule = async (id: string) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    console.log("일정 삭제 성공:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("일정 삭제 중 오류 발생:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "일정 삭제 중 오류가 발생했습니다.");
  }
};
