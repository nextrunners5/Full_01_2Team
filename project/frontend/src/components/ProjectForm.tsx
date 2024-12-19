// 프로젝트 추가/수정 폼 컴포넌트

import React from "react";
import "../pages/css/ProjectPage.css";

const ProjectDetails = () => {
  return (
    <div className="projectCreateContainer">
      <div className="projectCreateForm">
        <div className="createNewProject">
          <h2>새 프로젝트 추가</h2>
        </div>

        <div className="createDropContainer">

          <div className="projectImportance">
            <h3 className='h3'>중요도</h3>
            <form>
              <select name="combo_projectImportance">
                <option value="1">상</option>
                <option value="2">중</option>
                <option value="3">하</option>
              </select>
            </form>
          </div>

          <div className="projectStatus">
            <h3 className='h3'>진행 상태</h3> 
            <form>
              <select name="combo_projectStatus">
                <option value="run">진행중</option>
                <option value="wait">대기</option>
                <option value="finish">완료</option>
              </select>
            </form>
          </div>

          <div className="projectType">
            <h3 className='h3'>프로젝트 종류</h3>
            <form>
              <select name="combo_projectType">
                <option value="1">프로젝트</option>
                <option value="2">발표</option>
                <option value="3">보고서</option>
              </select>
            </form>
          </div>
        </div>

        <div className="projectTitle">
          <h3 className='h3'>프로젝트명</h3>
          <input type="text" placeholder='프로젝트명을 입력하세요'/>
        </div>

        <div className="projectDate">
          <div className="projectStartDate">
            <h3 className='h3'>시작일</h3>
            <form>
              <input type="date" />
            </form>
          </div>
          <div className="projectEndDate">
            <h3 className='h3'>종료일</h3>
            <form>
              <input type="date" />
            </form>
          </div>
        </div>

        <div className="projectManager">
          <h3 className='h3'>담당자</h3>
          <input type="text" placeholder='담당자명를 입력하세요'/>
        </div>

        <div className="projectDetail">
          <h3 className='h3'>프로젝트 설명</h3>
          <textarea rows={4} cols={50} placeholder='프로젝트에 대한 상세한 내용을 입력하세요'/>
        </div>

        <div className="createBtn">
          <button>프로젝트 추가</button>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;