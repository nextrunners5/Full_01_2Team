import React from "react";
import { FaBell, FaUser } from "react-icons/fa";
import logo from '../assets/logo.png';
import './css/Header.css';

interface HeaderProps {
  onLogoClick: () => void; 
}

const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <header className="header">
      <div className="logo" onClick={onLogoClick}>
        <img src={logo} alt="IdeaDaily Logo" />
      </div>
      <div className="icon-container"> 
        <div className="icon">
          <FaBell size={20} title="알림" />
        </div>
        <div className="icon">
          <FaUser size={20} title="로그인" />
        </div>
      </div>
    </header>
  );
};

export default Header;
