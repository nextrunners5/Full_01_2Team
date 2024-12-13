// 프로젝트 관리 페이지

import React from "react";
import Header from "../components/Header";

const ProjectPage: React.FC = () => {
  return (
    <div>
  <Header onLogoClick={function (): void {
        throw new Error("Function not implemented.");
      } } />
      <h2>프로젝트 페이지입니다!</h2>
    </div>
  )
}

export default ProjectPage;