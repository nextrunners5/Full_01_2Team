import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

const HomePage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <img src={logo} alt="logo" style={{ width: '200px', marginBottom: '20px' }} />
      <h1>메인 페이지</h1>
      <p>프로젝트 관리를 시작해보세요.</p>
      <div>
        <Link to="/login">
          <button style={buttonStyle}>로그인</button>
        </Link>
        <Link to="/register">
          <button style={buttonStyle}>회원가입</button>
        </Link>
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: '10px 20px',
  margin: '10px',
  backgroundColor: '#7d3cf8',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px',
};

export default HomePage;
