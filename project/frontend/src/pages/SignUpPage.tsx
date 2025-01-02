import "./css/SignUpPage.css";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUser, checkUsernameDuplicate } from "./axios/SignUpAxios";

const SignUpPage = () => {
  const navigate = useNavigate();

  // 오류 메시지 상태
  const [errorMessage, setErrorMessage] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  // 오류 애니메이션 상태
  const [errorShake, setErrorShake] = useState(false);

  // 아이디 중복 확인 상태
  const [isUsernameValid, setIsUsernameValid] = useState(false);

  // 아이디 중복 확인 핸들러
  const handleCheckUsername = async () => {
    const username = (document.getElementById("username") as HTMLInputElement)
      .value;

    if (!username) {
      setErrorMessage((prev) => ({
        ...prev,
        username: "아이디를 입력해주세요.",
      }));
      setErrorShake(true);
      setTimeout(() => setErrorShake(false), 500);
      return;
    }

    try {
      const response = await checkUsernameDuplicate(username);
      alert(response.message);
      setIsUsernameValid(true);
      setErrorMessage((prev) => ({ ...prev, username: "" }));
    } catch (error: any) {
      alert(error.message || "아이디 중복 확인에 실패했습니다.");
      setIsUsernameValid(false);
    }
  };

  // 회원가입 완료 핸들러
  const handleRegister = async () => {
    const username = (document.getElementById("username") as HTMLInputElement)
      .value;
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;
    const confirmPassword = (
      document.getElementById("confirmPassword") as HTMLInputElement
    ).value;
    const name = (document.getElementById("name") as HTMLInputElement).value;

    let hasError = false;
    const errors = {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    };

    if (!username) {
      errors.username = "아이디를 입력해주세요.";
      hasError = true;
    }
    if (!isUsernameValid) {
      errors.username = "아이디 중복 확인을 해주세요.";
      hasError = true;
    }
    if (!email || !email.includes("@")) {
      errors.email = "유효한 이메일을 입력해주세요.";
      hasError = true;
    }
    if (!password) {
      errors.password = "비밀번호를 입력해주세요.";
      hasError = true;
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = "비밀번호가 일치하지 않습니다.";
      hasError = true;
    }
    if (!name) {
      errors.name = "이름을 입력해주세요.";
      hasError = true;
    }

    setErrorMessage(errors);

    if (hasError) {
      setErrorShake(true);
      setTimeout(() => setErrorShake(false), 500);
      return;
    }

    try {
      const response = await registerUser({
        user_id: username,
        user_pw: password,
        user_pw_confirm: confirmPassword,
        user_name: name,
        user_email: email,
      });

      alert(response.message);
      navigate("/LoginPage");
    } catch (error: any) {
      alert(error.message || "회원가입 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="signup-container">
      <img src={logo} alt="logo" className="signup-logo" />
      <h2>회원가입</h2>
      <div className="signup-card">
        <div className="signup-form">
          {/* 아이디 입력 필드 */}
          <div className="input-wrapper">
            <div className="input-group">
              <input id="username" type="text" placeholder="아이디" />
              <button className="small-button" onClick={handleCheckUsername}>
                중복확인
              </button>
            </div>
            {errorMessage.username && (
              <p className={`error-message ${errorShake ? "shake" : ""}`}>
                {errorMessage.username}
              </p>
            )}
          </div>

          {/* 이메일 입력 필드 */}
          <div className="input-wrapper">
            <input id="email" type="email" placeholder="이메일 입력" />
            {errorMessage.email && (
              <p className={`error-message ${errorShake ? "shake" : ""}`}>
                {errorMessage.email}
              </p>
            )}
          </div>

          {/* 비밀번호 입력 필드 */}
          <div className="input-wrapper">
            <input id="password" type="password" placeholder="비밀번호" />
            {errorMessage.password && (
              <p className={`error-message ${errorShake ? "shake" : ""}`}>
                {errorMessage.password}
              </p>
            )}
          </div>

          {/* 비밀번호 확인 입력 필드 */}
          <div className="input-wrapper">
            <input
              id="confirmPassword"
              type="password"
              placeholder="비밀번호 확인"
            />
            {errorMessage.confirmPassword && (
              <p className={`error-message ${errorShake ? "shake" : ""}`}>
                {errorMessage.confirmPassword}
              </p>
            )}
          </div>

          {/* 이름 입력 필드 */}
          <div className="input-wrapper">
            <input id="name" type="text" placeholder="이름" />
            {errorMessage.name && (
              <p className={`error-message ${errorShake ? "shake" : ""}`}>
                {errorMessage.name}
              </p>
            )}
          </div>

          {/* 가입 버튼 */}
          <button className="signup-button" onClick={handleRegister}>
            가입하기
          </button>
        </div>
        <div className="signup-footer">
          <p>
            이미 계정이 있으신가요?{" "}
            <span className="login-link" onClick={() => navigate("/LoginPage")}>
              로그인하기
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
