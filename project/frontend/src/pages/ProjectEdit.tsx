import React, { useEffect, useState } from 'react';
import "./ProjectCreate.css";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ProjectForm, { Project } from '../components/ProjectForm';
import Sidebar from '../components/Sidebar';
import Header from '../components/Headar';

const ProjectEdit: React.FC = () => {
  const navigate = useNavigate();
  const {projectId} = useParams();
  const [project, setProject] = useState<Project | null>(null);


  useEffect(() => {
    console.log("projectId: ", projectId);
    const fetchProject = async () => {
      try{
        
        const response = await axios.get<Project>(`http://localhost:4000/api/projectService/${projectId}`);
        console.log("response.data:",response.data);

        setProject(response.data);
      } catch(err) {
        console.error('프로젝트 데이터를 불러오는 데 실패했습니다.', err);
      }
    };
    if(projectId){
      fetchProject();
    }
  },[projectId]);

  const handleUpdateProject = async (project: Project) => {
    try {
      const response = await axios.put(`http://localhost:4000/api/projectService/${projectId}`, project);
      console.log('프로젝트 수정 성공: ', response.data);
      alert('프로젝트가 수정되었습니다.');
      navigate('/');
    } catch(error){
      console.error('프로젝트 수정 실패: ', error);
      alert('프로젝트 수정에 실패했습니다.');
    }
  };

  const [isSidebarVisible, setSidebarVisible] = useState<boolean>(true);
  
  // 사이드바 토글 핸들러
  const handleLogoClick = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className='projectCreateContainer'>
      <div className={`sidebar ${isSidebarVisible ? "" : "hidden"}`} >
        <Sidebar/>
      </div>
      <div className={`mainContent ${isSidebarVisible ? "" : "expanded"}`}>
        <Header onLogoClick={handleLogoClick} />
        <div className="EditMain">
          {project ? (
          <ProjectForm
            project={project}
            onSubmit={handleUpdateProject}
            titleText="프로젝트 수정"
            buttonText="수정하기"
          />
          ) : (
          <div>프로젝트 정보를 불러오는 중...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectEdit;