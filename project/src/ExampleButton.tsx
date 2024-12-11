// 이 임시버튼페이지는 전체적인 구성 끝나면 지우겠습니다~

import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import SchedulePage from "./pages/SchedulePage";
import MainHomePage from "./pages/MainHomePage";
import ProjectPage from "./pages/ProjectPage";
import UserPage from "./pages/UserPage";
import LoginPage from "./pages/LoginPage";

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

  const ButtonExample = {
    buttonex: {
      width: "auto",
      padding: "20px",
      backgroundColor: "#f0f0f0",
      borderRight: "1px solid #ccc",
    },
  };

  return (
    <div>
      <div style={ButtonExample.buttonex}>
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
