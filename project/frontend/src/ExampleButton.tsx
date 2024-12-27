import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import SchedulePage from "./pages/SchedulePage";
import ProjectPage from "./pages/ProjectPage";
import UserPage from "./pages/UserPage";
import LoginPage from "./pages/LoginPage";
import ProjectDetails from "./pages/ProjectDetails";
import SignUpPage from "./pages/SignUpPage";
import "./ExampleButton.css"; // CSS 파일 import

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const LoginPageNavigate = () => {
    navigate("/LoginPage");
  };
  const SignUpPageNavigate = () => {
    navigate("/SignUpPage");
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
  const ProjectDetailsNavigate = () => {
    navigate("/ProjectDetails");
  };

  return (
    <div>
      <div className="button-container">
        {" "}
        {/* 클래스 이름 수정 */}
        <h1>임시 버튼들</h1>
        <button onClick={mainHomeNavigate}>메인 페이지로 이동</button>
        <button onClick={LoginPageNavigate}>로그인 페이지로 이동</button>
        <button onClick={SignUpPageNavigate}>회원가입 페이지로 이동</button>
        <button onClick={scheduleNavigate}>일정 페이지로 이동</button>
        <button onClick={projectNavigate}>프로젝트 페이지로 이동</button>
        <button onClick={userNavigate}>마이페이지 페이지로 이동</button>
        <button onClick={ProjectDetailsNavigate}>프로젝트 수정</button>
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
        <Route path="/SignUpPage" element={<SignUpPage />} />
        <Route path="/SchedulePage" element={<SchedulePage />} />
        <Route path="/ProjectPage" element={<ProjectPage />} />
        <Route path="/UserPage" element={<UserPage />} />
        <Route path="/ProjectDetails" element={<ProjectDetails />} />
      </Routes>
    </Router>
  );
};

export default SchedulePageRouter;
