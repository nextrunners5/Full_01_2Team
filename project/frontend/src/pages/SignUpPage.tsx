import "./css/SignUpPage.css";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [errorShake, setErrorShake] = useState(false);

  // 회원가입 완료 핸들러
  const handleRegister = () => {
    const username = (document.getElementById("username") as HTMLInputElement)
      .value;
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;
    const confirmPassword = (
      document.getElementById("confirmPassword") as HTMLInputElement
    ).value;

    if (username && email && password && password === confirmPassword) {
      setErrorMessage("");
      setErrorShake(false);
      alert("회원가입이 완료되었습니다.");
      navigate("/loginPage");
    } else {
      setErrorMessage("입력값을 확인해주세요. 비밀번호가 일치하지 않습니다.");
      setErrorShake(true); // 에러 발생 시 흔들림 효과 활성화
      setTimeout(() => setErrorShake(false), 500); // 흔들림 애니메이션 초기화
    }
  };

  return (
    <div className="signup-container">
      <img src={logo} alt="logo" className="signup-logo" />
      <h2>회원가입</h2>
      <div className="signup-form">
        <input id="username" type="text" placeholder="아이디" />
        <input id="email" type="email" placeholder="이메일" />
        <input id="password" type="password" placeholder="비밀번호" />
        <input id="confirmPassword" type="password" placeholder="비밀번호 확인" />
        <input id="name" type="text" placeholder="이름" />
        {errorMessage && (
          <p className={`error-message ${errorShake ? "shake" : ""}`}>
            {errorMessage}
          </p>
        )}
        <button className="signup-button" onClick={handleRegister}>
          가입하기
        </button>
      </div>

      <div className="signup-footer">
        <p>
          이미 계정이 있으신가요?{" "}
          <span className="login-link" onClick={() => navigate("/loginPage")}>
            로그인하기
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
