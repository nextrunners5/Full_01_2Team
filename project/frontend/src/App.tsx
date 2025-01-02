import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import SchedulePage from "./pages/SchedulePage";
import ProtectedRoute from "./pages/protected-route/ProtectedRoute";
import Mypage from "./pages/MyPage";
import MyPageEdit from "./pages/MyPageEdit";
import ProjectDashBoard from "./pages/ProjectDashBoard";

function App() {
  return (
    <Router>
      <Routes>
        {/* 공개 페이지 */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/SignUpPage" element={<SignUpPage />} />

        {/* 보호 페이지 */}
        <Route element={<ProtectedRoute />}>
          <Route path="/SchedulePage" element={<SchedulePage />} />
          <Route path="/ProjectDashBoard" element={<ProjectDashBoard />} />
          <Route path="/Mypage" element={<Mypage />} />
          <Route path="/MyPageEdit" element={<MyPageEdit />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
