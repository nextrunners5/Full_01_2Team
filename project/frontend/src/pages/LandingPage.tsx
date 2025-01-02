import "./css/LandingPage.css";
import logo from "../assets/logo.png";
import mainImg from "../assets/mainImg.png";
import MD2 from "../assets/MD2.mp4";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          } else {
            entry.target.classList.remove("show");
          }
        });
      },
      { threshold: 0.2 }
    );

    const fadeElements = document.querySelectorAll(".fade-in");
    fadeElements.forEach((el) => observer.observe(el));

    return () => {
      fadeElements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  // 로그인 페이지로 이동
  const goToLogin = () => {
    navigate("/LoginPage");
  };

  return (
    <div className="homepage">
      <header className="header fade-in">
        <img src={logo} alt="IdeaDaily Logo" />
        <button className="cta-button" onClick={goToLogin}>
          로그인
        </button>
      </header>

      <section className="hero fade-in">
        <h1>스마트한 일정관리의 시작</h1>
        <p>효율적인 시간 관리와 생산성 향상을 위한 최적의 솔루션</p>
      </section>

      <section className="features fade-in">
        <div className="boxcontainer">
          <h1>주요 기능</h1>
          <div className="box1">
            <h3>
              <i className="fas fa-calendar-alt"></i> 간편한 일정 등록
            </h3>
            <p>드래그 앤 드롭으로 손쉽게 일정을 관리하세요</p>
          </div>
          <div className="box1">
            <h3>
              <i className="fas fa-bell"></i> 알림 설정
            </h3>
            <p>중요한 일정을 놓치지 않도록 알림을 설정하세요</p>
          </div>
          <div className="box1">
            <h3>
              <i className="fas fa-users"></i> 팀 일정 공유
            </h3>
            <p>팀원과 일정을 공유하고 협업하세요</p>
          </div>
        </div>
        <img
          className="hero-image fade-in"
          src={mainImg}
          alt="Main Illustration"
        />
      </section>

      <section className="services fade-in">
        <h2>서비스 특징</h2>
        <div className="service-container">
          <div className="service">
            <i className="fa-solid fa-desktop"></i>
            <h3>데스크탑 최적화</h3>
            <p>언제 어디서나 노트북으로 편리하게 이용하세요</p>
          </div>
          <div className="service">
            <i className="fa-solid fa-shield-halved"></i>
            <h3>보안 강화</h3>
            <p>안전한 데이터 보호와 백업 시스템</p>
          </div>
          <div className="service">
            <i className="fa-solid fa-arrows-rotate"></i>
            <h3>실시간 동기화</h3>
            <p>모든 기기에서 실시간으로 동기화됩니다</p>
          </div>
        </div>
      </section>

      <section className="cta fade-in">
        <video autoPlay loop muted playsInline className="cta-video">
          <source src={MD2} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="cta-content">
          <h2>지금 바로 시작하세요</h2>
          <button className="cta-button" onClick={goToLogin}>
            로그인
          </button>
          <button className="cta-button secondary">더 알아보기</button>
        </div>
      </section>

      <footer className="footer fade-in">
        <div className="footer-content">
          <div>
            <h3>도움</h3>
            <p>FSO_박영빈</p>
            <p>FSO_민은빈</p>
          </div>
          <div>
            <h3>이메일</h3>
            <p>pybju0@gmail.com</p>
            <p>silverbinmin1004@gmail.com</p>
          </div>
          <div>
            <h3>고객지원</h3>
            <ul>
              <li>고객센터</li>
            </ul>
          </div>
          <div>
            <h3>주소</h3>
            <p>대전광역시</p>
            <p>042-1234-5678</p>
            <p>📧 info@company.com</p>
          </div>
        </div>
        <p className="copyright">
          © 2024 Inspire-D Team. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
