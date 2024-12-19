import React from 'react';
import { Link } from 'react-router-dom';
import './css/Sidebar.css';

const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <ul>
        <li><Link to="/MainHome">메인</Link></li>
        <li><Link to="/SchedulePage">일정</Link></li>
        <li><Link to="/ProjectPage">프로젝트</Link></li>
        <li><Link to="/UserPage">마이페이지</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;
