import React, { useState } from 'react';
import "./ProjectCreate.css";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProjectForm, { Project } from '../components/ProjectForm';
import Sidebar from '../components/Sidebar';
import Header from '../components/Headar';

const ProjectCreate: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateProject = async (project: Project) => {
    try {
      const response = await axios.post("http://localhost:4000/api/projectService", project);
      console.log('프로젝트 추가 성공: ', response.data);
      alert('프로젝트가 추가되었습니다.');
      navigate('/');
    } catch(error){
      console.error('프로젝트 추가 실패: ', error);
      alert('프로젝트 추가에 실패했습니다.');
    }
  };

  const [isSidebarVisible, setSidebarVisible] = useState<boolean>(true);
  
  // 사이드바 토글 핸들러
  const handleLogoClick = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className='projectCreateContainer'>
      <div className={`sidebar ${isSidebarVisible ? "" : "hidden"}`}>
        <Sidebar/>
      </div>
      <div className={`mainContent ${isSidebarVisible ? "" : "expanded"}`}>
        <Header onLogoClick={handleLogoClick} />
        <ProjectForm onSubmit={handleCreateProject} titleText='새 프로젝트 추가' buttonText='추가하기'/>
      </div>
    </div>
  );
};

export default ProjectCreate;
