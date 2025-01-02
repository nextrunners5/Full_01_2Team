import React, { useState, useEffect } from "react";
import UserInputField from "../components/UserInputField";
import "./css/MyPageEdit.css";
import Logo from "../assets/logo.png";
import profileImg1 from "../assets/profile1.webp";
import profileImg2 from "../assets/profile2.webp";
import profileImg3 from "../assets/profile3.webp";
import { useNavigate } from "react-router-dom";
import { getUserInfo, updateUserInfo, logoutUser, deleteUserAccount } from "./axios/UserAxios";

// 사용자 정보 인터페이스
interface UserInfo {
  user_id: string;
  user_name: string;
  user_email: string;
  profile_img: string;
  create_at: string;
}

// 프로필 이미지 목록
const profileImages = [
  { id: 1, src: profileImg1, label: "기본프로필 1" },
  { id: 2, src: profileImg2, label: "기본프로필 2" },
  { id: 3, src: profileImg3, label: "기본프로필 3" },
];

const MyPageEdit: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProfileImg, setSelectedProfileImg] = useState<string>(
    profileImg1
  );

  const [formData, setFormData] = useState({
    user_name: "",
    user_email: "",
    current_password: "",
    new_password: "",
    confirm_password: "",
    profile_img: profileImg1,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await getUserInfo();
        setUserInfo(response.user);
        setFormData({
          user_name: response.user.user_name,
          user_email: response.user.user_email,
          current_password: "",
          new_password: "",
          confirm_password: "",
          profile_img: response.user.profile_img || profileImg1,
        });
        setSelectedProfileImg(response.user.profile_img || profileImg1);
      } catch (error: any) {
        console.error("사용자 정보 가져오기 실패:", error.message);
        setError("사용자 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  // 입력값 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 프로필 이미지 변경 핸들러
  const handleProfileImgChange = (imgSrc: string) => {
    setSelectedProfileImg(imgSrc);
    setFormData((prev) => ({ ...prev, profile_img: imgSrc }));
  };

  // 저장 버튼 클릭 핸들러
  const handleSave = async () => {
    if (formData.new_password !== formData.confirm_password) {
      alert("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      await updateUserInfo(formData);
      alert("회원정보가 성공적으로 수정되었습니다.");
      navigate("/MyPage");
    } catch (error: any) {
      console.error("회원정보 수정 실패:", error.message);
      alert("회원정보 수정에 실패했습니다.");
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      try {
        await deleteUserAccount();
        alert("회원 탈퇴가 완료되었습니다.");
        logoutUser();
        navigate("/"); // 메인 페이지로 리다이렉트
      } catch (error: any) {
        console.error("회원 탈퇴 실패:", error.message);
        alert("회원 탈퇴 중 오류가 발생했습니다.");
      }
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="editbody">
      {/* 로고 */}
      <div className="logocontainer">
        <img src={Logo} alt="Logo 이미지" className="logo-img" />
        <div className="logotext"></div>
      </div>

      {/* 마이페이지 컨테이너 */}
      <div className="mypage-container">
        <div className="mypage-edit">
          {/* 프로필 이미지 섹션 */}
          <div className="profile-img-wrapper">
            <img
              src={selectedProfileImg}
              alt="프로필 이미지"
              className="profile-img"
            />
            <div className="profile-img-toggle">
              {profileImages.map((profile) => (
                <button
                  key={profile.id}
                  className={`profile-toggle-btn ${
                    selectedProfileImg === profile.src ? "active" : ""
                  }`}
                  onClick={() => handleProfileImgChange(profile.src)}
                >
                  {profile.label}
                </button>
              ))}
            </div>
          </div>

          {/* 사용자 정보 입력 필드 */}
          <UserInputField
            label="이름"
            type="text"
            value={formData.user_name}
            name="user_name"
            onChange={handleChange}
            placeholder="이름을 입력하세요"
          />

          <UserInputField
            label="이메일"
            type="email"
            value={formData.user_email}
            name="user_email"
            onChange={handleChange}
            placeholder="이메일을 입력하세요"
          />

          <UserInputField
            label="현재 비밀번호"
            type="password"
            value={formData.current_password}
            name="current_password"
            onChange={handleChange}
            placeholder="현재 비밀번호"
          />

          <UserInputField
            label="새 비밀번호"
            type="password"
            value={formData.new_password}
            name="new_password"
            onChange={handleChange}
            placeholder="새 비밀번호"
          />

          <UserInputField
            label="새 비밀번호 확인"
            type="password"
            value={formData.confirm_password}
            name="confirm_password"
            onChange={handleChange}
            placeholder="새 비밀번호 확인"
          />

          {/* 버튼 그룹 */}
          <div className="button-group">
            <button className="save-button" onClick={handleSave}>
              저장하기
            </button>
            <button
              className="cancel-button"
              onClick={() => navigate("/MyPage")}
            >
              취소
            </button>
          </div>
          <div className="delete-account-section">
            <button className="delete-account-button" onClick={handleDeleteAccount}>
              탈퇴하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPageEdit;
