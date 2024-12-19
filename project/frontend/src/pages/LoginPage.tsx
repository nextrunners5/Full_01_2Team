import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react"; // useState 추가
import logo from "../assets/logo.png";

const LoginPage = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태 추가

  // 로그인 성공 핸들러
  const handleLogin = () => {
    const username = (document.getElementById("username") as HTMLInputElement)
      .value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;

    if (username === "admin" && password === "1234") {
      setErrorMessage(""); // 에러 메시지 초기화
      alert("로그인 성공!");
      navigate("/"); // 메인 페이지로 이동
    } else {
      setErrorMessage("아이디 또는 비밀번호가 일치하지 않습니다."); // 에러 메시지 설정
    }
  };

  const handleGoogleSuccess = (credentialResponse: { credential?: string }) => {
    console.log("Google Login Success:", credentialResponse);
    setErrorMessage(""); // 에러 메시지 초기화
    alert("Google 로그인 성공!");
    navigate("/"); // 메인 페이지로 이동
  };

  const handleGoogleFailure = () => {
    console.log("Google Login Failed");
    setErrorMessage("Google 로그인 실패. 다시 시도해주세요.");
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <div style={containerStyle}>
        <img src={logo} alt="logo" style={logoStyle} />
        <h2>idea Daily에 오신 것을 환영합니다</h2>
        <p>프로젝트 관리를 더 쉽고 효율적으로 시작하기</p>
        <div style={formContainerStyle}>
          <input
            id="username"
            type="text"
            placeholder="아이디"
            style={inputStyle}
          />
          <input
            id="password"
            type="password"
            placeholder="비밀번호"
            style={inputStyle}
          />
          {errorMessage && <p style={errorStyle}>{errorMessage}</p>}{" "}
          {/* 에러 메시지 표시 */}
          <button style={buttonStyle} onClick={handleLogin}>
            로그인
          </button>
          <p style={dividerStyle}>또는 다음으로 계속</p>
          <div style={{ margin: "0 auto" }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleFailure}
            />
          </div>
          <p style={{ marginTop: "20px" }}>
            계정이 없으신가요?{" "}
            <Link to="/register" style={linkStyle}>
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

const containerStyle = {
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center",
  justifyContent: "center",
  height: "100vh",
  textAlign: "center" as const,
  boxSizing: "border-box" as const,
};

const logoStyle = {
  width: "200px",
  marginBottom: "20px",
};

const formContainerStyle = {
  width: "100%",
  maxWidth: "400px",
  padding: "0 10px",
  boxSizing: "border-box" as const,
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  margin: "10px 0",
  border: "1px solid #ccc",
  borderRadius: "5px",
  boxSizing: "border-box" as const,
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  backgroundColor: "#7d3cf8",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
  boxSizing: "border-box" as const,
};

const dividerStyle = {
  margin: "20px 0",
  fontSize: "14px",
  color: "#666",
};

const errorStyle = {
  color: "red",
  marginBottom: "10px",
};

const linkStyle = {
  color: "#7d3cf8",
  textDecoration: "none",
};

export default LoginPage;
