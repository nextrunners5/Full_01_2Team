import React, { useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import logo from '../assets/logo.png';
import defaultProfileImg from '../assets/profile1.webp';
import './css/Header.css';
import { getUserInfo } from '../pages/axios/UserAxios';

interface HeaderProps {
  onLogoClick: () => void; 
}

interface UserInfo {
  user_name: string;
  profile_img: string;
}

const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); 
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await getUserInfo();
        if (response && response.user) {
          setIsLoggedIn(true);
          setUserInfo({
            user_name: response.user.user_name,
            profile_img: response.user.profile_img || defaultProfileImg,
          });
        }
      } catch (error) {
        console.error("사용자 정보 가져오기 실패:", error);
        setIsLoggedIn(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleProfileClick = () => {
    navigate('/MyPage');
  };

  return (
    <header className="header">
      {/* 로고 */}
      <div className="logo" onClick={onLogoClick}>
        <img src={logo} alt="IdeaDaily Logo" />
      </div>

      {/* 아이콘 컨테이너 */}
      <div className="icon-container"> 
        {isLoggedIn && userInfo ? (
          <div className="user-profile" onClick={handleProfileClick}>
            <img 
              src={userInfo.profile_img} 
              alt="User Profile" 
              className="user-profile-img"
            />
            <span className="user-name">{userInfo.user_name}</span>
          </div>
        ) : (
          <div className="icon">
            <FaUser size={20} title="로그인" />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
