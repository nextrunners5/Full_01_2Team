import React from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import SchedulePage from "./pages/SchedulePage";
import MainHomePage from "./pages/MainHomePage";
import ProjectPage from "./pages/ProjectPage";
import UserPage from "./pages/UserPage";
import LoginPage from "./pages/LoginPage";
import './ExampleButton.css'; // CSS 파일 import

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const LoginPageNavigate = () => {
    navigate("/LoginPage");
  };
  const mainHomeNavigate = () => {
    navigate("/MainHomePage");
  };
  const scheduleNavigate = () => {
    navigate("/SchedulePage");
  };
  const projectNavigate = () => {
    navigate("/ProjectPage");
  };
  const userNavigate = () => {
    navigate("/UserPage");
  };

  return (
    <div>
      <div className="button-container"> {/* 클래스 이름 수정 */}
        <h1>임시 버튼들</h1>
        <button onClick={mainHomeNavigate}>메인 페이지로 이동</button>
        <button onClick={LoginPageNavigate}>로그인 페이지로 이동</button>
        <button onClick={scheduleNavigate}>일정 페이지로 이동</button>
        <button onClick={projectNavigate}>프로젝트 페이지로 이동</button>
        <button onClick={userNavigate}>마이페이지 페이지로 이동</button>
      </div>
    </div>
  );
};

const SchedulePageRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/MainHomePage" element={<MainHomePage />} />
        <Route path="/SchedulePage" element={<SchedulePage />} />
        <Route path="/ProjectPage" element={<ProjectPage />} />
        <Route path="/UserPage" element={<UserPage />} />
      </Routes>
    </Router>
  );
};

export default SchedulePageRouter;
