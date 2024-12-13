// 메인 홈 페이지

import React from 'react';
import Header from '../components/Header';

const MainHomePage: React.FC = () => {
  return (
    <div>
      <Header onLogoClick={function (): void {
        throw new Error('Function not implemented.');
      } } />
      <h2>로그인 해야 보이는 메인 페이지입니다!</h2>;
    </div>
  )
};

export default MainHomePage;
