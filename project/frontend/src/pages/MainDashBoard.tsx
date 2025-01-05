import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Headar";
import Sidebar from "../components/Sidebar";
import { BiLoaderCircle } from "react-icons/bi";
import { FaCircleCheck, FaListCheck } from "react-icons/fa6";
import { MdAccessTimeFilled } from "react-icons/md";
import axiosInstance from "./axios/ProjectAxios";
import { PiNotePencilFill } from "react-icons/pi";
import "./MainDashBoard.css";

interface Project {
  project_id: number;
  project_title: string;
  project_details: string;
  project_status: string;
  project_type: string;
  project_endDate: number;
}

interface Schedule {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
}

const MainDashBoard: React.FC = () => {
  const navigate = useNavigate();

  const statusClassName: Record<string, string> = {
    진행중: "statusProgress",
    완료: "statusComplete",
    대기: "statusWait",
  };

  const typeClassName: Record<string, string> = {
    프로젝트: "typeProject",
    발표: "typePresentation",
    보고서: "typeReport",
  };

  const [isSidebarVisible, setSidebarVisible] = useState<boolean>(true);

  // 사이드바 토글 핸들러
  const handleLogoClick = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  const [all, setAll] = useState<number | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [wait, setWait] = useState<number | null>(null);
  const [complete, setComplete] = useState<number | null>(null);
  const [monthlySchedules, setMonthlySchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const responseAll = await axiosInstance.get<number>(
          "/api/ProjectDashBoard/ProjectAll"
        );
        setAll(responseAll.data);
        const responseProgress = await axiosInstance.get<number>(
          "/api/MainDashBoard/ProjectProgress"
        );
        setProgress(responseProgress.data);
        const responseWait = await axiosInstance.get<number>(
          "/api/MainDashBoard/ProjectWait"
        );
        setWait(responseWait.data);
        const responseComplete = await axiosInstance.get<number>(
          "/api/MainDashBoard/ProjectComplete"
        );
        setComplete(responseComplete.data);
      } catch (err) {
        console.error("모든 프로젝트 값을 가져오는 데 실패했습니다.", err);
      }
    };
    fetchStatus();
  }, []);

  const projectStatusData = [
    {
      title: "총 프로젝트",
      name: "all",
      value: all,
      icon: <FaListCheck className="allIcon1" />,
    },
    {
      title: "진행중",
      name: "progress",
      value: progress,
      icon: <BiLoaderCircle className="progressIcon1" />,
    },
    {
      title: "완료",
      name: "complete",
      value: complete,
      icon: <FaCircleCheck className="completeIcon1" />,
    },
    {
      title: "대기",
      name: "wait",
      value: wait,
      icon: <MdAccessTimeFilled className="planIcon1" />,
    },
  ];

  const [describe, setDescribe] = useState<Project[]>([]);

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/LoginPage");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axiosInstance.get<Project[]>(
          `/api/MainDashBoard/ProjectData`
        );
        // setDescribe(response.data);
        setDescribe(Array.isArray(response.data) ? response.data : []);
        console.log(response.data);
      } catch (err) {
        console.error("프로젝트 정보를 가져오는 데 실패했습니다.", err);
      }
    };
    fetchProjects();
  }, []);

  // 이번 달 일정
  useEffect(() => {
    const fetchMonthlySchedules = async () => {
      try {
        const response = await axiosInstance.get<{
          success: boolean;
          data: Schedule[];
        }>("/api/MainDashBoard/Monthly");
        if (response.data.success) {
          setMonthlySchedules(response.data.data);
          console.log("이번 달 일정:", response.data.data);
        }
      } catch (err) {
        console.error("이번 달 일정을 가져오는 데 실패했습니다.", err);
      }
    };

    fetchMonthlySchedules();
  }, []);

  return (
    <div className="mainDashBoardContainer">
      <div className={`sidebar ${isSidebarVisible ? "" : "hidden"}`}>
        <Sidebar />
      </div>
      <div className={`mainContent ${isSidebarVisible ? "" : "expanded"}`}>
        <Header onLogoClick={handleLogoClick} />
        <div className="mainBody">
          <div className="projectStatusBox">
            {projectStatusData.map((status, index) => (
              // <div className="numberBox" key={index} onClick={() => handleChangeProject(status.title)}>
              <div className="numberBox" key={index}>
                <div className={`${status.name.toLowerCase()}IconDiv`}>
                  <div>{status.icon}</div>
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
          <div className="projectBody">
            <div className="topBox">
              <div className="topLeft">
                <h3 className="topTitle">진행 중인 프로젝트</h3>
              </div>
              <div className="topRight">
                {/* <div className="listBtn">리스트</div> */}
                <Link to={"/ProjectDashBoard"} className="listBtnLink">
                  <div className="projectDashBtn">
                    <PiNotePencilFill className="modifyIcon" />
                    <h3>바로가기</h3>
                  </div>
                </Link>
              </div>
            </div>
            <div className="bottomBox">
              {describe.map((describe) => (
                <Link
                  to={`/ProjectEachDetails/${describe.project_id}`}
                  className="detailProject"
                >
                  <div className="projectListBody" key={describe.project_title}>
                    <div className="recentProjectTitle">
                      <h3 className="title">{describe.project_title}</h3>
                      <div className="statusAndType">
                        <div
                          className={`typeColor ${typeClassName[describe.project_type]}`}
                        >
                          {describe.project_type}
                        </div>
                        <div
                          className={`statusColor ${statusClassName[describe.project_status]}`}
                        >
                          {describe.project_status}
                        </div>
                      </div>
                    </div>
                    <div className="projectDescribe">
                      {describe.project_details}
                    </div>
                    <div className="bottomDateBox">
                      <div className="bottom2">
                        마감일 {describe.project_endDate}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="scheduleBody">
  <div className="month">
    <h3>이번 달 일정</h3>
    <ul className="monthlyScheduleList">
      {monthlySchedules.length > 0 ? (
        monthlySchedules.map((schedule) => (
          <li key={schedule.id} className="monthlyScheduleItem">
            <div className="scheduleDot" style={{ backgroundColor: schedule.id % 2 === 0 ? '#9c88ff' : '#6F42C1' }}></div>
            <div className="scheduleDetails">
              <strong>{schedule.title}</strong>
              <p>({schedule.startDate} ~ {schedule.endDate})</p>
            </div>
          </li>
        ))
      ) : (
        <p className="noSchedule">이번 달 예정된 일정이 없습니다.</p>
      )}
    </ul>
  </div>
</div>

        </div>
      </div>
    </div>
  );
};

export default MainDashBoard;
