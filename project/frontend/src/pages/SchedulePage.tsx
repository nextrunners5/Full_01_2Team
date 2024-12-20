import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Headar";
import Calendar from "../components/Schedule/Calendar";
import ScheduleModal from "../components/Schedule/ScheduleModal";
import './css/SchedulePage.css';

interface Event {
  title: string;
  date: string;
  description?: string;
}

const SchedulePage: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
   // 사이드바 표시 상태 추가
  const [isSidebarVisible, setSidebarVisible] = useState<boolean>(true);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleAddEvent = (event: { startDate: Date | null ; endDate: Date | null; startTime: string; endTime: string; title: string; description: string; }) => {
    if (selectedEvent) {
      console.log("이벤트 수정:", event.title, event.startDate);
      // 수정 로직 구현
    } else {
      console.log("새 일정 추가:", event.title, event.startDate);
      // 추가 로직 구현
    }
  };
  // 사이드바 핸들러
  const handleLogoClick = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="container">
      {/* 사이드바 표시 여부 */}
      {isSidebarVisible && <Sidebar />}
      <div className="mainContent">
        {/* 헤더, 사이드바 핸들러 */}
        <Header onLogoClick={handleLogoClick} />
        <div className="centerContainer">
          <div className="centerbox">
            <div className="centercard">
              {/* 캘린더 */}
              <Calendar userId="user123" onEventClick={handleEventClick} />
            </div>
          </div>
          <div className="rightSidebar">
            <div className="dateContainer">
              <p>{new Date().toLocaleDateString()}</p>
              <button className="styled-button" onClick={() => setIsModalOpen(true)}>+ 일정</button>
            </div>
            <p>오른쪽 사이드바 내용</p>
          </div>
        </div>
      </div>
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddEvent}
        selectedEvent={selectedEvent as Event | null}
      />
    </div>
  );
};

export default SchedulePage;
