import axios from "axios";

// API 기본 URL 설정
const API_BASE_URL = "http://localhost:3000/api/Schedules";

// Axios 인스턴스 생성
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// 요청 인터셉터: 인증 토큰 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // 로컬 스토리지에서 토큰 가져오기
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Authorization 헤더에 토큰 추가
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 일정 저장 API (POST)
export const saveSchedule = async (scheduleData: {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
}) => {
  try {
    const response = await axiosInstance.post("/", scheduleData);
    console.log("일정 저장 응답:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("일정 저장 중 오류 발생:", error.response?.data || error.message);
    throw new Error("일정을 저장하는 중 오류가 발생했습니다.");
  }
};

// 일정 수정 API (PUT)
export const updateSchedule = async (id: string, scheduleData: {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  title: string;
  description: string;
}) => {
  try {
    const response = await axiosInstance.put(`/${id}`, scheduleData);
    console.log("일정 수정 응답:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("일정 수정 중 오류 발생:", error.response?.data || error.message);
    throw new Error("일정을 수정하는 중 오류가 발생했습니다.");
  }
};

// 일정 조회 API (GET)
export const fetchSchedules = async () => {
  try {
    const response = await axiosInstance.get("/");
    console.log("일정 데이터 불러오기 성공:", response.data);
    return response.data.data;
  } catch (error: any) {
    console.error("일정 데이터 불러오기 실패:", error.response?.data || error.message);
    throw new Error("일정을 불러오는 중 오류가 발생했습니다.");
  }
};

// 일정 삭제 API (DELETE)
export const deleteSchedule = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/${id}`);
    console.log("일정 삭제 성공:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("일정 삭제 중 오류 발생:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "일정 삭제 중 오류가 발생했습니다.");
  }
};

// 일주일간의 일정 조회 API (GET) 
export const fetchUpcomingSchedules = async () => {
  try {
    const response = await axiosInstance.get("/upcoming");
    console.log("일주일간의 일정 조회 성공:", response.data);
    return response.data.data;
  } catch (error: any) {
    console.error("일주일간의 일정 조회 실패:", error.response?.data || error.message);
    throw new Error("일주일간의 일정을 불러오는 중 오류가 발생했습니다.");
  }
};
