import React, { useEffect, useState } from "react";
import "./css/MyPage.css";
import Logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { getUserInfo, logoutUser } from "./axios/UserAxios";
import { Link } from "react-router-dom";

// 사용자 정보 인터페이스
interface UserInfo {
  user_id: string;
  user_name: string;
  user_email: string;
  profile_img: string;
  create_at: string;
}

const MyPage: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // 로딩 상태 추가
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await getUserInfo();
        setUserInfo(response.user);
      } catch (error: any) {
        console.error("사용자 정보 가져오기 실패:", error.message);
        setError("사용자 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  // 로그아웃 핸들러
  const handleLogout = () => {
    logoutUser();
    navigate("/LoginPage");
  };

  if (loading) {
    return (
      <div className="mypage-wrapper">
        <div className="mypage-container">
          <h2>마이페이지</h2>
          <p>로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mypage-wrapper">
        <div className="mypage-container">
          <h2>마이페이지</h2>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mypage-wrapper">
      <div className="mypage-header">
        <img src={Logo} alt="프로필 이미지" />
      </div>
      <div className="mypage-container">
        <div className="mypage-content">
        <div className="profile-img-container">
        <img
          src={userInfo?.profile_img || Logo}
          alt="사용자 프로필 이미지"
          className="profile-img"
        />
      </div>
          {userInfo ? (
            <div className="user-info-card">
              <h3>{userInfo.user_name}</h3>
              <p>{userInfo.user_email}</p>
              <hr />
              <div className="user-details">
                <div>
                  <strong>아이디:</strong> {userInfo.user_id}
                </div>
                <div>
                  <strong>이름:</strong> {userInfo.user_name}
                </div>
                <div>
                  <strong>가입일:</strong> {userInfo.create_at}
                </div>
              </div>
              <button
                className="update-button"
                onClick={() => navigate("/MyPageEdit")}
              >
                회원정보 수정
              </button>
              <button className="logout-button" onClick={handleLogout}>
                로그아웃
              </button>
              <Link to="/SchedulePage" className="schedule-link">
                되돌아가기
              </Link>
            </div>
          ) : (
            <p>사용자 정보를 불러오는 데 실패했습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
