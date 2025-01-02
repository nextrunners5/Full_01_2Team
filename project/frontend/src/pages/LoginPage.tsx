import "./css/LoginPage.css";
import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { loginUser } from "./axios/SignUpAxios";

const LoginPage = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [errorShake, setErrorShake] = useState(false); // 에러 애니메이션 상태
  const [rememberMe, setRememberMe] = useState(false); // 로그인 상태 유지 여부

  // 에러 애니메이션 리셋
  useEffect(() => {
    if (errorShake) {
      const timer = setTimeout(() => {
        setErrorShake(false);
      }, 300); // 애니메이션 지속 시간과 동일하게 설정
      return () => clearTimeout(timer);
    }
  }, [errorShake]);

  // 로그인 핸들러
  const handleLogin = async () => {
    const username = (document.getElementById("username") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;

    if (!username || !password) {
      setErrorMessage("아이디와 비밀번호를 입력해주세요.");
      setErrorShake(true);
      return;
    }

    try {
      const response = await loginUser({ user_id: username, user_pw: password });

      // 토큰 저장 및 페이지 이동
      if (response.token) {
        localStorage.setItem("token", response.token);
        alert(response.message || "로그인 성공!");
        navigate("/SchedulePage");
      } else {
        throw new Error("토큰이 반환되지 않았습니다.");
      }
    } catch (error: any) {
      console.error("로그인 실패:", error.message);
      setErrorMessage(error.message || "로그인 중 오류가 발생했습니다.");
      setErrorShake(true);
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="logo" className="login-logo" />
      <h2>idea Daily에 오신 것을 환영합니다</h2>
      <p>프로젝트 관리를 더 쉽고 효율적으로 시작하기</p>
      <div className="login-form">
        <label htmlFor="username">아이디</label>
        <input id="username" type="text" placeholder="아이디" />

        <label htmlFor="password">비밀번호</label>
        <div className="input-with-error">
          <input id="password" type="password" placeholder="비밀번호" />
          {errorMessage && (
            <p className={`error-message ${errorShake ? "shake" : ""}`}>
              {errorMessage}
            </p>
          )}
        </div>

        <div className="login-options">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            로그인 상태 유지
          </label>
          <Link to="/forgot-password">비밀번호를 잊으셨나요?</Link>
        </div>

        <button className="login-button" onClick={handleLogin}>
          로그인
        </button>

        <p className="divider">계정이 없으신가요?</p>
        <p className="signup-text">
          <Link to="/SignUpPage" className="signup-link">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
