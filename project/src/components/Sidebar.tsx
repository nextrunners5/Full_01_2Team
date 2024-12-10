// 사이드바 컴포넌트

import React from 'react';
import { Link } from 'react-router-dom';
import textImage from '../assets/text.png'; // 경로는 Sidebar 컴포넌트의 위치에 따라 조정

const sideStyle = {
  sidebar: {
    width: '200px',
    padding: '20px',
    backgroundColor: '#f0f0f0',
    borderRight: '1px solid #ccc',
  },
  image: {
    width: '200px',
    height: 'auto',
  },
};

const Sidebar: React.FC = () => {
  return (
    <div style={sideStyle.sidebar}>
      <img src={textImage} alt="사진" style={sideStyle.image} />
      <ul>
        <li><Link to="/MainHome">메인</Link></li>
        <li><Link to="/schedulePage">일정</Link></li>
        <li><Link to="/ProjectPage">프로젝트</Link></li>
        <li><Link to="/UserPage">마이페이지</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
