import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api/User',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 사용자 정보 가져오기
export const getUserInfo = async () => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('토큰이 존재하지 않습니다.');

  try {
    const response = await api.get('/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // 성공 시 사용자 정보 반환
  } catch (error: any) {
    console.error('사용자 정보 가져오기 오류:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || '사용자 정보를 불러오는 데 실패했습니다.');
  }
};

// 마이페이지 업데이트 API
export const updateUserInfo = async (formData: any) => {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('토큰이 존재하지 않습니다.');

  try {
    const response = await api.put('/update', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('사용자 정보 업데이트 오류:', error.response?.data?.message || error.message);
    throw new Error(error.response?.data?.message || '사용자 정보 업데이트에 실패했습니다.');
  }
};

// 사용자 계정 삭제
export const deleteUserAccount = async () => {
  try {
    const response = await axios.delete("http://localhost:3000/api/User/delete", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    console.log("회원 탈퇴 성공:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("회원 탈퇴 중 오류 발생:", error.response?.data || error.message);
    throw new Error("회원 탈퇴 중 오류가 발생했습니다.");
  }
};

// 로그아웃
export const logoutUser = () => {
  localStorage.removeItem("token");
};
