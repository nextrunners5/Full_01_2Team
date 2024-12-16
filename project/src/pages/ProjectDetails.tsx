import React, { useEffect, useState } from 'react';
import "./ProjectPage.css";
import axios from 'axios';

interface Common{
  common_id: number;
  common_detail: string;
}

const ProjectDetails: React.FC = () => {
  
  const [project, setProject] = useState({
    importance: '1',
    status: 'run',
    type: '1',
    title: '',
    startDate: '',
    endDate: '',
    manager: '',
    description: '',
  })

  const [status, setStatus] = useState<Common[]>([]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get('http://localhost:3300/api/commonStatus');
        setStatus(response.data);
      } catch (err){
        console.error('상태 데이터를 불러오는 데 실패했습니다.',err);
      }
    };

    fetchStatus();
  },[]);


  const [type, setType] = useState<Common[]>([]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get('http://localhost:3300/api/commonType');
        setType(response.data);
      } catch (err){
        console.error('타입 데이터를 불러오는 데 실패했습니다.',err);
      }
    };

    fetchStatus();
  },[]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {name, value} = e.target;
    setProject((prev) => ({
      ...prev,
      [name] : value,
    }));
  };

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();

    try {

      const response = await axios.post("http://localhost:3300/api/projectService", project);
      console.log('프로젝트 추가 성공: ', response.data);
      alert('프로젝트가 추가되었습니다.');
    } 
    catch(error){
      console.error('프로젝트 추가 실패: ', error);
      alert('프로젝트 추가에 실패했습니다.');
    }

  }

  
  return (
    <div className="projectCreateContainer">
      <form onSubmit={handleSubmit}>

        <div className="projectCreateForm">
          <div className="createNewProject">
            <h2>새 프로젝트 추가</h2>
          </div>

          <div className="createDropContainer">

            <div className="projectImportance">
              <h3 className='h3'>중요도</h3>
                <select name="importance" value={project.importance} onChange={handleChange}>
                  <option value="1">상</option>
                  <option value="2">중</option>
                  <option value="3">하</option>
                </select>
            </div>

            <div className="projectStatus">
              <h3 className='h3'>진행 상태</h3> 
                <select name="status" value={project.status} onChange={handleChange}>
                  //value 값을 데이터베이스에서 조회해와야 함. 배열로 돌리기
                  {status.map((status) => (
                    <option key={status.common_id} value={status.common_detail}>
                      {status.common_detail}
                    </option>
                  ))}
                </select>
            </div>

            <div className="projectType">
              <h3 className='h3'>프로젝트 종류</h3>
                <select name="type" value={project.type} onChange={handleChange}>
                  {type.map((type) => (
                    <option key={type.common_id} value={type.common_detail}>
                      {type.common_detail}
                    </option>
                  ))}
                </select>
            </div>
          </div>

          <div className="projectTitle">
            <h3 className='h3'>프로젝트명</h3>
            <input 
              type="text" 
              name='title'
              placeholder='프로젝트명을 입력하세요'
              value={project.title}
              onChange={handleChange}
              />
          </div>

          <div className="projectDate">
            <div className="projectStartDate">
              <h3 className='h3'>시작일</h3>
                <input 
                  type="date"
                  name='startDate'
                  value={project.startDate}
                  onChange={handleChange} />
            </div>
            <div className="projectEndDate">
              <h3 className='h3'>종료일</h3>
              <input 
                  type="date"
                  name='endDate'
                  value={project.endDate}
                  onChange={handleChange} />
            </div>
          </div>

          <div className="projectManager">
            <h3 className='h3'>담당자</h3>
            <input 
              type="text" 
              name='manager'
              value={project.manager}
              onChange={handleChange}
              placeholder='담당자명를 입력하세요'/>
          </div>

          <div className="projectDetail">
            <h3 className='h3'>프로젝트 설명</h3>
            <textarea 
              rows={4}
              cols={50} 
              name='description'
              value={project.description}
              onChange={handleChange}
              placeholder='프로젝트에 대한 상세한 내용을 입력하세요'/>
          </div>

          <div className="createBtn">
            <button type='submit'>프로젝트 추가</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProjectDetails;
