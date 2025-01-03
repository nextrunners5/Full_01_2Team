// import {Link} from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import SelectBox from "../components/ProjectSelect";

//icon / css
import { PiNotePencilFill } from "react-icons/pi";
import { LuPlus } from "react-icons/lu";
import { MdDelete } from "react-icons/md";
import "./ProjectEachDetails.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/Headar";

interface Common{
  common_id: number;
  common_detail: string;
}

interface Project{
  project_id: number;
  project_title: string;
  project_details: string;
  project_status: string;
  project_rank: number;
  project_startDate: number;
  project_endDate: number;
}

interface TaskItem{
  task_id: number;
  task_name: string;
  task_manager: string;
  task_startDate: string;
  task_endDate: string;
  task_status: string;
}

const ProjectEachDetails: React.FC = () => {
  const {projectId} = useParams();

  const projectTaskStatus: Record<string,string> = {
    '진행중' : 'progress',
    '완료' : 'complete',
    '대기' : 'wait',
  };

  const [project, setProject] = useState({
    id: projectId,
    title: '',
    description: '',
    status: '진행중',
    importance: '1',
    startDate: '',
    endDate: '',
  });

  const [workItem, setWorkItem] = useState({
    task_name: '',
    task_manager: '',
    task_startDate: '',
    task_endDate: '',
    task_status: '진행중',
  });


  //add버튼 클릭시 입력폼 나타내기
  const [formVisible, setFormVisible] = useState(false)
  
  //추가된 작업 목록 상태
  const [taskList, setTaskList] = useState<TaskItem[]>([]);

  useEffect(() => {
    const fetchTaskList = async () => {
      try{
        const response = await axios.get<TaskItem[]>(`http://localhost:3400/api/tasks/${projectId}`);
        setTaskList(response.data);
      } catch (err) {
        console.error('작업 리스트를 가져오는 데 실패했습니다.', err);
      }
    };

    fetchTaskList();
  },[projectId]);

  //상태 목록 불러오기
  const [status, setStatus] = useState<Common[]>([]);

  useEffect(() => {
    const fetchStatus = async () => {
      try{
        const response = await axios.get<Common[]>('http://localhost:3400/api/tasks/Status');
        setStatus(response.data);
        console.log(response.data);
      } catch(err) {
        console.error('프로젝트 상태 데이터를 불러오는 데 실패했습니다.', err);
      }
    };
    fetchStatus();
  },[]);

  // Project테이블에서 데이터 불러오기
  const [details, setDetails] = useState<Project | null>(null); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Project[]>(`http://localhost:3400/api/tasks/ProjectEachDetails/${projectId}`);
        if(response.data.length > 0){
          setDetails(response.data[0]);
        } else {
          console.log("프로젝트 데이터가 없습니다.");
        }
      } catch (err) {
        console.error('프로젝트 데이터를 가져오는 데 실패했습니다.', err);
      }
    };
    fetchData();
  }, [projectId]);

  //작업 리스트 추가
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try{
      const response = await axios.post('http://localhost:3400/api/tasks', {...workItem, project_id: projectId});
      console.log('작업 추가 성공: ', response.data);
      
      const newResponse = await axios.get(`http://localhost:3400/api/tasks/${projectId}`);
      console.log('작업 리스트: ',newResponse.data);
      alert('작업이 추가되었습니다.');

      setTaskList(newResponse.data);

      setWorkItem({
        task_name: "",
        task_manager: "",
        task_startDate: "",
        task_endDate: "",
        task_status: "진행중",
      });

      // setFormVisible(false);
    } catch(err) {
      console.error('작업 추가 실패: ', err);
      alert('작업 추가에 실패했습니다.');

      setWorkItem({
        task_name: "",
        task_manager: "",
        task_startDate: "",
        task_endDate: "",
        task_status: "진행중",
      });
    }
  }


  //form input 내용 변경시 실행
  const handleWorkItemChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const {name, value} = e.target;
    setWorkItem((prev) => ({
      ...prev,
      [name] : value,
    }));
  };

  const handleProjectChange = async(e: React.ChangeEvent<HTMLSelectElement>): Promise<void> => {
    const {name, value} = e.target;

    setProject((prev) => ({
      ...prev,
      [name] : value,
    }));
    try{
      const response = await axios.get(`http://localhost:3400/api/tasks/filter/${projectId}/${value}`);
      console.log("response.data:",response.data);
      console.log('작업 리스트: ',response.data);
      setTaskList(response.data);

    } catch(err){
      console.error('상태별 작업 리스트 보여주기 실패.', err);
    }
  };

  const handleToggleForm = () => {
    setFormVisible((prev) => !prev);
  };

  //세부 일정 수정
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editedTask, setEditedTask] = useState<Partial<TaskItem>>({});

  const startEditing = (task: TaskItem) => {
    const confirmed = window.confirm('수정하시겠습니까?');
    if(confirmed){
      setEditingTaskId(task.task_id);
      setEditedTask(task);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>{
    const {name, value} = e.target;
    setEditedTask((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateTask = async(taskId: number): Promise<void> => {

    try{
      const response = await axios.put(`http://localhost:3400/api/tasks/${taskId}`, editedTask);
      setTaskList((prev) => prev.map((task) => (task.task_id === taskId ? response.data :  task)));

      const newResponse = await axios.get(`http://localhost:3400/api/tasks/${projectId}`);
      console.log('작업 리스트: ',newResponse.data);
      setTaskList(newResponse.data);

      alert('작업이 수정되었습니다.');
      setEditingTaskId(null);
    } catch(err){
      console.error('수정에 실패했습니다.', err);
      alert('수정에 실패했습니다.');
    }
  }

  //세부 일정 삭제
  const handleDeleteTask = async (taskId: number): Promise<void> => {
    const confirmDelete = window.confirm('삭제하시겠습니까?');
    if(!confirmDelete) return;

    try{
      await axios.delete(`http://localhost:3400/api/tasks/${taskId}`);
      setTaskList((prev) => prev.filter(task => task.task_id !== taskId));

      alert('작업이 삭제되었습니다.');
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
    <div className="eachDetailsContainer">
      <div className={`sidebar ${isSidebarVisible ? "" : "hidden"}`}>
        <Sidebar />
      </div>
      <div className={`mainContent ${isSidebarVisible ? "" : "expanded"}`}>
        <Header onLogoClick={handleLogoClick} />
        <div className="main">
        {/* 상단 */}
        <div className="eachDetailsTop">
          <div className="eachProjectTitleContainer">
            <div className="eachProjectTitleTop">
              <div className="eachProjectTitle">{details?.project_title}</div>
              <div className="eachProjectImportant">중요도: {details?.project_rank}</div>
              <div className="eachProjectStatus">{details?.project_status}</div>
            </div>
            <div className="eachProjectModifyBtn">
              <Link to={`/ProjectEdit/${details?.project_id}`} className="ModifyBtnLink">
              <div className="modifyBtn">
                <PiNotePencilFill className="pencilIcon"/>
                <h3>프로젝트 수정</h3>
              </div>
              </Link>
            </div>
          </div>
          <div className="eachProjectTitleBottom">
            <div className="eachProjectStartDate">시작일: {details?.project_startDate}</div>
            <div className="eachProjectEndDate">종료일: {details?.project_endDate}</div>
          </div>
        </div>

        {/* 중간 */}
        <div className="eachDetailsMid">
          <div className="eachDetailMidTitle">프로젝트 설명</div>
          <div className="eachProjectDescription">{details?.project_details}</div>
        </div>

        {/* 하단 */}
        <div className="eachDetailsBottom">
            <div className="selectContainer">
              <h3 className="selectTitle">상태</h3>
              <SelectBox
                label="상태"
                name="status"
                value={project.status}
                options={status}
                onChange={handleProjectChange}
                className="selectStatus"
              />
            </div>

          <div className="workListContainer">
            <div className="workList">
              <div className="workListTitle">작업명</div>
              <div className="workListManager">담당자</div>
              <div className="workListStartDate">시작일</div>
              <div className="workListEndDate">종료일</div>
              <div className="workListStatus">상태</div>
            </div>
            <div className="editData">
              {Array.isArray(taskList) && taskList.map((task, index) => (
                <div key={index} className="editMap">
                  {editingTaskId === task.task_id ? (
                    <>
                      <div className="editTitle">
                        <input
                          className="editTitle"
                          value={editedTask.task_name || ''}
                          type="text"
                          name="task_name"
                          onChange={handleEditChange}/>
                      </div>
                      <div className="editManager">
                        <input
                          className="editManager"
                          value={editedTask.task_manager || ''}
                          type="text"
                          name="task_manager"
                          onChange={handleEditChange}/>
                      </div>
                      <div className="editStartDate">
                        <input
                          className="editStartDate"
                          value={editedTask.task_startDate || ''}
                          type="text"
                          name="task_startDate"
                          onChange={handleEditChange}/>
                      </div>
                      <div className="editEndDate">
                        <input
                          className="editEndDate"
                          value={editedTask.task_endDate || ''}
                          type="text"
                          name="task_endDate"
                          onChange={handleEditChange}/>
                      </div>
                      <div className="editStatus">
                        <SelectBox
                          label="상태"
                          name="task_status"
                          value={editedTask.task_status || ''}
                          options={status}
                          onChange={handleEditChange}
                          className="editStatus"
                          />
                      </div>
                      <div className="addBtn">
                        <button onClick={() => handleUpdateTask(task.task_id)}><LuPlus className="plusIcon"/></button>
                      </div>
                    </>
                  ) : (
                    <>
                    <div className="workListTitle">{task.task_name}</div>
                    <div className="workListManager">{task.task_manager}</div>
                    <div className="workListStartDate">{task.task_startDate}</div>
                    <div className="workListEndDate">{task.task_endDate}</div>
                    <div className="workListStatus">
                      {/* <div className="statusDataDiv">{task.task_status}</div> */}
                      <div className={`statusDataDiv ${projectTaskStatus[task.task_status]}`}>{task.task_status}</div>
                    </div>
                    <div className="taskModify">
                      {/* <div className="taskUpdate"><PiNotePencilFill className="pencilIcon"/></div> */}
                      <div className="taskUpdate" onClick={() => startEditing(task)}><PiNotePencilFill className="pencilIcon"/></div>
                      <div className="taskDelete" onClick={() => handleDeleteTask(task.task_id)}><MdDelete className="trashIcon"/></div>
                    </div>
                    </>
                  )}
                </div>
              ))}
            </div>
            {formVisible && (
                <form onSubmit={handleSubmit} className="registerList">
                  <div className="workListTitle">
                    <input
                      className="workListTitle"
                      value={workItem.task_name}
                      type="text"
                      name="task_name"
                      placeholder="작업명"
                      onChange={handleWorkItemChange}/>
                  </div>
                  <div className="workListManager">
                    <input
                      className="workListManager"
                      value={workItem.task_manager}
                      type="text"
                      name="task_manager"
                      placeholder="홍길동"
                      onChange={handleWorkItemChange}/>
                  </div>
                  <div className="workListStartDate">
                    <input
                      className="workListStartDate"
                      value={workItem.task_startDate}
                      type="text"
                      name="task_startDate"
                      placeholder="2000.01.01"
                      onChange={handleWorkItemChange}/>
                  </div>
                  <div className="workListEndDate">
                    <input
                      className="workListEndDate"
                      value={workItem.task_endDate}
                      type="text"
                      name="task_endDate"
                      placeholder="2000.01.01"
                      onChange={handleWorkItemChange}/>
                  </div>
                    <div className="workListStatus">
                      <SelectBox
                        label="상태"
                        name="task_status"
                        value={workItem.task_status}
                        options={status}
                        onChange={handleWorkItemChange}
                        className="editStatus"
                      />
                    </div>
                  <div className="addBtn">
                    <button type='submit'><LuPlus className="plusIcon"/></button>
                  </div>
                </form>
            )}

          </div>
          <div className="createTask">
            <button onClick={handleToggleForm}><LuPlus className="plusIcon"/><div className="createTaskTitle">작업 추가</div></button>
          </div>
        </div>
      </div>
      </div>


    </div>
  )
}

export default ProjectEachDetails;