import axios from 'axios';

// Axios 인스턴스 설정
const api = axios.create({
  // baseURL: 'http://localhost:3000/api/User', // API 서버 베이스 URL
  baseURL: `http://3.39.228.210:3000/api/User`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 회원가입 API
export const registerUser = async (userData: any) => {
  try {
    const response = await api.post('/register', userData);
    return response.data;
  } catch (error: any) {
    console.error('회원가입 API 오류:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || '회원가입에 실패했습니다.');
  }
};

// 아이디 중복 확인 API
export const checkUsernameDuplicate = async (username: string) => {
  try {
    const response = await api.post('/check-username', { username });
    return response.data;
  } catch (error: any) {
    console.error('아이디 중복 확인 오류:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || '아이디 중복 확인에 실패했습니다.');
  }
};

// JWT localStorage에 저장
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 로그인 API
interface LoginParams {
  user_id: string;
  user_pw: string;
}

export const loginUser = async (loginData: LoginParams) => {
  try {
    const response = await api.post('/login', loginData);
    return response.data;
  } catch (error: any) {
    console.error('로그인 API 오류:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || '로그인에 실패했습니다.');
  }
};