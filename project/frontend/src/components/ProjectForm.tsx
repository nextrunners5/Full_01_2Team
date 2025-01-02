import React, { useEffect, useState } from 'react';
// import "./ProjectCreate.css";
import '../pages/ProjectCreate.css'
import axios from 'axios';

interface Common{
  common_id: number;
  common_detail: string;
}

export interface Project {
  id?: number;
  importance : string;
  status : string;
  type : string;
  title : string;
  startDate : string;
  endDate : string;
  manager : string;
  description: string;
}

interface ProjectFormProps {
  project?: Project;
  onSubmit: (project: Project) => void;
  titleText: string;
  buttonText: string;
}

const ProjectForm: React.FC<ProjectFormProps> = ({project = {
  id: undefined,
  importance: '1',
  status: '진행중',
  type: '프로젝트',
  title: '',
  startDate: '',
  endDate: '',
  manager: '',
  description: '',
}, onSubmit, titleText, buttonText}) => { 

  const [status, setStatus] = useState<Common[]>([]);
  const [type, setType] = useState<Common[]>([]);
  const [formData, setFormData] = useState<Project>(project);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await axios.get<Common[]>('http://localhost:4000/api/commonStatus');
        setStatus(response.data);
      } catch (err){
        console.error('상태 데이터를 불러오는 데 실패했습니다.',err);
      }
    };
    
    const fetchType = async () => {
      try {
        const response = await axios.get<Common[]>('http://localhost:4000/api/commonType');
        setType(response.data);
      } catch (err){
        console.error('타입 데이터를 불러오는 데 실패했습니다.',err);
      }
    };

    fetchStatus();
    fetchType();
  },[]);

  useEffect(() => {
    if (status.length > 0 && type.length > 0) {
      setFormData((prev) => ({
        ...prev,
        status: status[0].common_detail,
        type: type[0].common_detail,
      }));
    }
  }, [status, type]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {name, value} = e.target;
    setFormData((prev) => ({
      ...prev,
      [name] : value,
    }));
  };

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();

    if(!formData.startDate || !formData.endDate){
      alert('날짜를 선택해 주세요.');
      return;
    }

    if(new Date(formData.startDate) > new Date(formData.endDate)){
      alert('종료일은 시작일보다 늦어야 합니다.');
      return;
    }
    onSubmit(formData);
  }

  
  return (
    <div className="projectCreateContainer">
      <form onSubmit={handleSubmit}>

        <div className="projectCreateForm">
          <div className="createNewProject">
            {/* <h2>새 프로젝트 추가</h2> */}
            <h2>{titleText}</h2>
          </div>

          <div className="createDropContainer">

            <div className="projectImportance">
              <h3 className='h3'>중요도</h3>
              <select name="importance" value={formData.importance} onChange={handleChange}>
                <option value="1">상</option>
                <option value="2">중</option>
                <option value="3">하</option>
              </select>
            </div>

            <div className="projectStatus">
              <h3 className='h3'>진행 상태</h3> 
                <select name="status" value={formData.status} onChange={handleChange}>
                  {status.map((status) => (
                    <option key={status.common_id} value={status.common_detail}>
                      {status.common_detail}
                    </option>
                  ))}
                </select>
            </div>

            <div className="projectType">
              <h3 className='h3'>프로젝트 종류</h3>
                <select name="type" value={formData.type} onChange={handleChange}>
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
              value={formData.title}
              onChange={handleChange}
              />
          </div>

          <div className="projectDate">
            <div className="projectStartDate">
              <h3 className='h3'>시작일</h3>
                <input 
                  type="date"
                  name='startDate'
                  value={formData.startDate}
                  onChange={handleChange} />
            </div>
            <div className="projectEndDate">
              <h3 className='h3'>종료일</h3>
              <input 
                  type="date"
                  name='endDate'
                  value={formData.endDate}
                  onChange={handleChange} />
            </div>
          </div>

          <div className="projectManager">
            <h3 className='h3'>담당자</h3>
            <input 
              type="text" 
              name='manager'
              value={formData.manager}
              onChange={handleChange}
              placeholder='담당자명를 입력하세요'/>
          </div>

          <div className="projectDetail">
            <h3 className='h3'>프로젝트 설명</h3>
            <textarea 
              rows={4}
              cols={50} 
              name='description'
              value={formData.description}
              onChange={handleChange}
              placeholder='프로젝트에 대한 상세한 내용을 입력하세요'/>
          </div>

          <div className="createBtn">
            <button type='submit'>{buttonText}</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProjectForm;
