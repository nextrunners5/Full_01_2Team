// 상단 헤더 컴포넌트

import React from "react";
import { FaBell, FaUser } from "react-icons/fa";

const Header: React.FC = () => {
  return (
    <header className="header" style={headerStyle}>
      <div className="logo">
        <h1>IdeaDaily</h1>
      </div>
      <div className="header-icons" style={iconContainerStyle}>
        <div style={iconStyle}>
          <FaBell size={20} title="알림" />
        </div>
        <div style={iconStyle}>
          <FaUser size={20} title="로그인" />
        </div>
      </div>
    </header>
  );
};
 
const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 20px",
  backgroundColor: "#f8f8f8",
  borderBottom: "1px solid #ccc",
  height: "3rem",
};

const iconContainerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
};

const iconStyle: React.CSSProperties = {
  marginLeft: "20px",
  cursor: "pointer",
};

export default Header;
