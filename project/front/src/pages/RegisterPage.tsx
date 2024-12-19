import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom'; // useNavigate 추가
import { useState } from 'react'; // useState 추가
import logo from '../assets/logo.png';

const RegisterPage = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const [errorMessage, setErrorMessage] = useState(''); // 에러 메시지 상태

  // 회원가입 완료 핸들러
  const handleRegister = () => {
    const username = (document.getElementById('username') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value;

    if (username && email && password && password === confirmPassword) {
      setErrorMessage(''); // 에러 메시지 초기화
      alert('회원가입이 완료되었습니다.');
      navigate('/login'); // 로그인 페이지로 이동
    } else {
      setErrorMessage('입력값을 확인해주세요. 비밀번호가 일치하지 않습니다.');
    }
  };

  const handleGoogleSuccess = (credentialResponse: { credential?: string }) => {
    console.log('Google Signup Success:', credentialResponse);
    alert('Google 회원가입 성공!');
    navigate('/login'); // Google 회원가입 완료 후 로그인 페이지로 이동
  };

  const handleGoogleFailure = () => {
    console.log('Google Signup Failed');
    setErrorMessage('Google 회원가입에 실패했습니다.');
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <div style={containerStyle}>
        <img src={logo} alt="logo" style={logoStyle} />
        <h2>회원가입</h2>
        <div style={formContainerStyle}>
          <input id="username" type="text" placeholder="아이디" style={inputStyle} />
          <input id="email" type="email" placeholder="이메일" style={inputStyle} />
          <input id="password" type="password" placeholder="비밀번호" style={inputStyle} />
          <input id="confirmPassword" type="password" placeholder="비밀번호 확인" style={inputStyle} />
          <input id="name" type="text" placeholder="이름" style={inputStyle} />
          {errorMessage && <p style={errorStyle}>{errorMessage}</p>} {/* 에러 메시지 표시 */}
          <button style={buttonStyle} onClick={handleRegister}>
            가입하기
          </button>
          <p style={dividerStyle}>또는 Google 계정으로 가입</p>
          <div style={{ margin: '0 auto' }}>
            <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleFailure} />
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

const containerStyle = {
  display: 'flex',
  flexDirection: 'column' as const,
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  textAlign: 'center' as const,
  boxSizing: 'border-box' as const,
};

const logoStyle = {
  width: '200px',
  marginBottom: '20px',
};

const formContainerStyle = {
  width: '100%',
  maxWidth: '400px',
  padding: '0 10px',
  boxSizing: 'border-box' as const,
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  margin: '10px 0',
  border: '1px solid #ccc',
  borderRadius: '5px',
  boxSizing: 'border-box' as const,
};

const buttonStyle = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#7d3cf8',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
  boxSizing: 'border-box' as const,
};

const dividerStyle = {
  margin: '20px 0',
  fontSize: '14px',
  color: '#666',
};

const errorStyle = {
  color: 'red',
  marginBottom: '10px',
};

export default RegisterPage;
