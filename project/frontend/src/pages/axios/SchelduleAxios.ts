import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api/Schedules";

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
    return response.data;
  } catch (error) {
    console.error("일정 저장 중 오류 발생:", error);
    throw error;
  }
};
