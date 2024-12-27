import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import SchedulePage from "./pages/SchedulePage";
import ProjectPage from "./pages/ProjectPage";
import UserPage from "./pages/UserPage";
import ProjectDetails from "./pages/ProjectDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path="/SignUpPage" element={<SignUpPage />} />
        <Route path="/SchedulePage" element={<SchedulePage />} />
        <Route path="/ProjectPage" element={<ProjectPage />} />
        <Route path="/UserPage" element={<UserPage />} />
        <Route path="/ProjectDetails" element={<ProjectDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
