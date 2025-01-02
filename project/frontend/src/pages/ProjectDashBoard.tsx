// 프로젝트 관리 페이지
import {Link, useNavigate} from "react-router-dom";
import "./ProjectDashBoard.css";
import { useEffect, useState } from "react";
import axios from "axios";

//icon
import { FaListCheck } from "react-icons/fa6";
import { BiLoaderCircle } from "react-icons/bi";
import { FaCircleCheck } from "react-icons/fa6";
import { MdAccessTimeFilled } from "react-icons/md";
import { LuPlus } from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import Sidebar from "../components/Sidebar";
import Header from "../components/Headar";

interface Project{
  project_id: number;
  project_title: string;
  project_details: string;
  project_status: string;
  project_endDate: number;
}

interface ImportantProject{
  project_title: string;
  project_endDate: number;
}
const ProjectDashBoard: React.FC = () => {
  const navigate = useNavigate();

  const statusClassName: Record<string,string> = {
    '진행중' : 'statusProgress',
    '완료' : 'statusComplete',
    '대기' : 'statusWait',
  };

  //상태별 프로젝트 수
  const [all, setAll] = useState<number | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [wait, setWait] = useState<number | null>(null);
  const [complete, setComplete] = useState<number | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const responseAll = await axios.get<number>('http://localhost:3000/api/ProjectDashBoard/ProjectAll');
        setAll(responseAll.data);
        const responseProgress = await axios.get<number>('http://localhost:3000/api/ProjectDashBoard/ProjectProgress');
        setProgress(responseProgress.data);
        const responseWait = await axios.get<number>('http://localhost:3000/api/ProjectDashBoard/ProjectWait');
        setWait(responseWait.data);
        const responseComplete = await axios.get<number>('http://localhost:3000/api/ProjectDashBoard/ProjectComplete');
        setComplete(responseComplete.data);
      } catch(err){
        console.error('모든 프로젝트 값을 가져오는 데 실패했습니다.', err);
      }
    };
    fetchStatus();
  },[]);

  //유저의 모든 프로젝트 가져오기
  const [describe, setDescribe] = useState<Project[]>([]);

  useEffect(()=> {
    const fetchProjects = async () => {
      try {
        const response = await axios.get<Project[]>('http://localhost:3000/api/ProjectDashBoard/ProjectData');
        setDescribe(response.data);
        console.log(response.data);
      } catch (err) {
        console.error('프로젝트 정보를 가져오는 데 실패했습니다.',err);
      }
    };
    fetchProjects();
  },[]);


  //중요도에 따른 프로젝트
  const [important, setImportant] = useState<ImportantProject[]>([]);

  useEffect(()=> {
    const fetchProjects = async () => {
      try {
        const response = await axios.get<ImportantProject[]>('http://localhost:3000/api/ProjectDashBoard/ImportanceProject');
        setImportant(response.data);
      } catch (err) {
        console.error('중요도에 따른 프로젝트를 가져오지 못했습니다.', err);
      }
    };
    fetchProjects();
  },[]);


  //각 상태 클릭시 해당 값만 리스트
  const handleChangeProject = async (statusName: string) => {
    try{
      const response = await axios.get(`http://localhost:3000/api/ProjectDashBoard/ProjectData/${statusName}`);
      setDescribe(response.data);
      console.log(response.data);
    } catch(err){
      console.log("status:",statusName);
      console.error('리스트를 가져오지 못했습니다.', err);
    }
  }

  const projectStatusData = [
    {title: "총 프로젝트", name:"all", value: all, icon:<FaListCheck className="allIcon1"/>},
    {title: "진행중", name:"progress", value: progress, icon:<BiLoaderCircle className="progressIcon1"/>},
    {title: "완료", name: "complete", value: complete, icon:<FaCircleCheck className="completeIcon1"/>},
    {title: "대기", name: "wait", value: wait, icon:<MdAccessTimeFilled className="planIcon1"/>},
  ]

  //프로젝트 삭제 핸들러
  const handleDeleteProject = async(projectId: number) => {
    console.log("projectId: ",projectId);
    const confirmDelete = window.confirm('삭제하시겠습니까?');
    if(!confirmDelete) return;

    try{
      await axios.delete(`http://localhost:3000/api/ProjectDashBoard/ProjectService/${projectId}`);
      setDescribe((prev) => prev.filter(describe => describe.project_id !== projectId));

      alert('작업이 삭제되었습니다.');

      navigate('/');
    } catch(err){
      console.error('삭제에 실패했습니다.', err);
      alert('삭제에 실패했습니다.');
    }
  }
  const [isSidebarVisible, setSidebarVisible] = useState<boolean>(true);
  
    // 사이드바 토글 핸들러
    const handleLogoClick = () => {
      setSidebarVisible(!isSidebarVisible);
    };

  return (
    <div className="projectDashBoardContainer">
      {/* <div className="side"> */}
        <div className={`sidebar ${isSidebarVisible ? "" : "hidden"}`}>
          <Sidebar />
        </div>
        <div className={`mainContent ${isSidebarVisible ? "" : "expanded"}`}>
          <Header onLogoClick={handleLogoClick} />
          <div className="main">
            <div className="projectDashBoardTitle">
              <h1>프로젝트 대시보드</h1>  
            </div>
            <div className="bigCurrentBoard">
              {projectStatusData.map((status, index) => (
                <div className="numberBox" key={index} onClick={() => handleChangeProject(status.title)}>
                  <div className={`${status.name.toLowerCase()}Icon`}>
                    {status.icon}
                  </div>
                  <div className="rightText">
                    <h3 className="numberTitle">{status.title}</h3>
                    <h3 className={`${status.name.toLowerCase()}Number1`}>
                      {status.value !== null ? status.value : 0}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            <div className="projectDetailContainer">
              <div className="topProjectDetailContainer">
              <div className="left">
                <div className="recentProjectContainer">
                  <div className="recentProjectTitle">
                    <h2>최근 프로젝트</h2>
                  </div>
                  {describe.map((describe) => (
                    <div className="eachProjectContainer">
                      <div className="recentProjectBody" key={describe.project_title}>
                      <Link to= {`/ProjectEachDetails/${describe.project_id}`} className="detailProject">
                        <div className="recentProjectEachTitle">
                          <h3 className="title">{describe.project_title}</h3>
                          <div className={`smallStatus ${statusClassName[describe.project_status]}`}>{describe.project_status}</div>
                        </div>
                        <div className="projectDescribe">{describe.project_details}</div>
                        <div className="bottom1">
                          <div className="bottom2">진행률</div>
                          <div className="bottom2">마감일 {describe.project_endDate}</div>
                        </div>
                        <div className="projectDelete" ><MdDelete className="trashIcon" onClick={() => handleDeleteProject(describe.project_id)}/></div>
                      </Link>
                      </div>
                    </div>

                  ))}
                </div>
              </div>

              {/* body 오른쪽 */}
              <div className="right">
                <div className = "projectCreateBtn">
                      {/* <Link to={'/ProjectDetails'} className="createBtnLink"> */}
                      <Link to={'/ProjectCreate'} className="createBtnLink">
                        <div className="purpleBtn">
                          <LuPlus className="plusIcon"/>
                          <h3>프로젝트 추가하기</h3>
                        </div>
                      </Link>
                </div>
                <div className="smallCurrentBoard">
                  <h2 className="smallCurrentBoardText">프로젝트 중요도</h2>
                  {important.map((important) => (
                    <div className="ImportantPlan">
                      <h3 className="ImportantTitle">{important.project_title}</h3>
                      <h3 className="importantDate">{important.project_endDate}</h3>
                    </div>  
                  ))}
                </div>
              </div>
              </div>
              <div className="bottomProjectDetailContainer">
                  <Link to={'/DashBoard'} className="backBtnLink">
                          <h3>메인 대시보드로 돌아가기</h3>
                  </Link>
              </div>
            </div>
          </div>
        </div>
      {/* </div> */}
    </div>
  )
}

export default ProjectDashBoard;