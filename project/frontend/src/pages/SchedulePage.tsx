import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Headar";
import Calendar from "../components/Schedule/Calendar";
import ScheduleModal from "../components/Schedule/ScheduleModal";
import RightSidebar from "../components/Schedule/rightSidebar";
import {
  saveSchedule,
  updateSchedule,
  deleteSchedule,
} from "./axios/ScheduleAxios";
import "./css/SchedulePage.css";

// 이벤트 인터페이스
interface Event {
  id: string;
  title: string;
  start: string | Date;
  end?: string | Date;
  description?: string;
}

// 모드 타입
type ModalMode = "add" | "edit";

const SchedulePage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<ModalMode>("add");
  const [isSidebarVisible, setSidebarVisible] = useState<boolean>(true);
  const [scheduleUpdated, setScheduleUpdated] = useState<boolean>(false); // 일정 변경 트리거
  const calendarRef = useRef<{
    updateSize: () => void;
    refreshEvents: () => void;
  } | null>(null);

  // 사용자 인증 확인
  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/LoginPage");
    }
  }, [navigate]);

  // 이벤트 클릭 핸들러 (수정 모드)
  const handleEventClick = (event: Event) => {
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.start,
      end: event.end || "",
      description: event.description || "",
    });
    setModalMode("edit");
    setIsModalOpen(true);
  };

  // 이벤트 추가 버튼 클릭 (추가 모드)
  const handleAddButtonClick = () => {
    setSelectedEvent(null);
    setModalMode("add");
    setIsModalOpen(true);
  };

  // 일정 저장 및 수정 핸들러
  const handleSaveEvent = async (event: {
    startDate: Date | null;
    endDate: Date | null;
    startTime: string;
    endTime: string;
    title: string;
    description: string;
  }) => {
    try {
      const formattedSchedule = {
        startDate: event.startDate?.toISOString().split("T")[0] || "",
        endDate: event.endDate?.toISOString().split("T")[0] || "",
        startTime: event.startTime,
        endTime: event.endTime,
        title: event.title,
        description: event.description,
      };

      if (modalMode === "add") {
        await saveSchedule(formattedSchedule);
        alert("일정이 추가되었습니다!");
      } else if (modalMode === "edit" && selectedEvent?.id) {
        await updateSchedule(selectedEvent.id, formattedSchedule); // PUT 요청
        alert("일정이 수정되었습니다!");
      }

      calendarRef.current?.refreshEvents();
      setScheduleUpdated((prev) => !prev);
      setIsModalOpen(false);
    } catch (error) {
      console.error("일정 저장/수정 실패:", error);
      alert("일정을 저장/수정하는 데 실패했습니다.");
    }
  };

  // 일정 삭제 핸들러
  const handleDeleteEvent = async () => {
    if (selectedEvent && selectedEvent.id) {
      try {
        await deleteSchedule(selectedEvent.id);
        alert("일정이 삭제되었습니다!");
        calendarRef.current?.refreshEvents();
        setScheduleUpdated((prev) => !prev);
        setIsModalOpen(false);
      } catch (error) {
        console.error("일정 삭제 실패:", error);
        alert("일정을 삭제하는 데 실패했습니다.");
      }
    }
  };

  // 사이드바 토글 핸들러
  const handleLogoClick = () => {
    setSidebarVisible(!isSidebarVisible);
    setTimeout(() => {
      calendarRef.current?.updateSize();
    }, 300);
  };

  return (
    <div className="container">
      <div className={`sidebar ${isSidebarVisible ? "" : "hidden"}`}>
        <Sidebar />
      </div>
      <div className={`mainContent ${isSidebarVisible ? "" : "expanded"}`}>
        <Header onLogoClick={handleLogoClick} />
        <div className="centerContainer">
          <div className="centerbox">
            <div className="centercard">
              <Calendar onEventClick={handleEventClick} ref={calendarRef} />
            </div>
          </div>
          <RightSidebar
            onAddButtonClick={handleAddButtonClick}
            scheduleUpdated={scheduleUpdated}
          />
        </div>
      </div>

      {/* 일정 모달 */}
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        selectedEvent={
          selectedEvent
            ? {
                startDate:
                  typeof selectedEvent.start === "string"
                    ? selectedEvent.start
                    : selectedEvent.start.toISOString().split("T")[0],
                endDate:
                  typeof selectedEvent.end === "string"
                    ? selectedEvent.end
                    : selectedEvent.end?.toISOString().split("T")[0] || "",
                startTime: "",
                endTime: "",
                title: selectedEvent.title,
                description: selectedEvent.description || "",
              }
            : null
        }
        mode={modalMode}
      />
    </div>
  );
};

export default SchedulePage;
