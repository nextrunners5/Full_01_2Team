import { Link, useLocation } from "react-router-dom";
import { FaHome, FaCalendarAlt, FaTasks, FaUser } from "react-icons/fa";
import "./css/Sidebar.css";

const Sidebar: React.FC = () => {
  const location = useLocation(); // 현재 경로 확인

  return (
    <div className="sidebar">
      <ul>
        <li className={location.pathname === "/MainDashBoard" ? "active" : ""}>
          <Link to="/MainDashBoard">
            <FaHome /> 메인
          </Link>
        </li>
        <li className={location.pathname === "/SchedulePage" ? "active" : ""}>
          <Link to="/SchedulePage">
            <FaCalendarAlt /> 일정
          </Link>
        </li>
        <li className={location.pathname === "/ProjectDashBoard" ? "active" : ""}>
          <Link to="/ProjectDashBoard">
            <FaTasks /> 프로젝트
          </Link>
        </li>
        <li className={location.pathname === "/Mypage" ? "active" : ""}>
          <Link to="/Mypage">
            <FaUser /> 마이페이지
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
