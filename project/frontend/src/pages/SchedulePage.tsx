import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Headar";
import Calendar from "../components/Schedule/Calendar";
import ScheduleModal from "../components/Schedule/ScheduleModal";
import { saveSchedule } from "./axios/SchelduleAxios";
import './css/SchedulePage.css';

interface Event {
  title: string;
  date: string;
  description?: string;
}

const SchedulePage: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isSidebarVisible, setSidebarVisible] = useState<boolean>(true);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleAddEvent = async (event: {
    startDate: Date | null;
    endDate: Date | null;
    startTime: string;
    endTime: string;
    title: string;
    description: string;
  }) => {
    try {
      if (selectedEvent) {
        console.log("이벤트 수정:", event.title, event.startDate);
        // 수정 로직 구현
      } else {
        // 새 일정 추가 API 호출
        const formattedSchedule = {
          startDate: event.startDate?.toISOString().split("T")[0] || "",
          endDate: event.endDate?.toISOString().split("T")[0] || "",
          startTime: event.startTime,
          endTime: event.endTime,
          title: event.title,
          description: event.description,
        };

        const response = await saveSchedule(formattedSchedule);
        console.log("일정 저장 성공:", response);

        alert("일정이 저장되었습니다!");
      }
    } catch (error) {
      console.error("일정 저장 실패:", error);
      alert("일정을 저장하는 데 실패했습니다.");
    }
  };

  const handleLogoClick = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  return (
    <div className="container">
      {isSidebarVisible && <Sidebar />}
      <div className="mainContent">
        <Header onLogoClick={handleLogoClick} />
        <div className="centerContainer">
          <div className="centerbox">
            <div className="centercard">
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
