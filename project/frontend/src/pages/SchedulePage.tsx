import React, { useState, useRef } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Headar";
import Calendar from "../components/Schedule/Calendar";
import ScheduleModal from "../components/Schedule/ScheduleModal";
import RightSidebar from "../components/Schedule/rightSidebar";
import { saveSchedule, updateSchedule, deleteSchedule } from "./axios/ScheduleAxios";
import './css/SchedulePage.css';

/* 이벤트 인터페이스 */
interface Event {
  id: string;
  title: string;
  start: string | Date;
  end?: string | Date;
  description?: string;
}

/* 모드 타입 */
type ModalMode = "add" | "edit";

const SchedulePage: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalMode, setModalMode] = useState<ModalMode>("add");
  const [isSidebarVisible, setSidebarVisible] = useState<boolean>(true);
  const calendarRef = useRef<{ updateSize: () => void; refreshEvents: () => void } | null>(null);

  /* 이벤트 클릭 핸들러 (수정 모드) */
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

  /* 이벤트 추가 버튼 클릭 (추가 모드) */
  const handleAddButtonClick = () => {
    setSelectedEvent(null);
    setModalMode("add");
    setIsModalOpen(true);
  };

  /* 일정 저장 및 수정 핸들러 */
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
        await saveSchedule(formattedSchedule); // POST 요청
        alert("일정이 추가되었습니다!");
      } else if (modalMode === "edit" && selectedEvent?.id) {
        await updateSchedule(selectedEvent.id, formattedSchedule); // PUT 요청
        alert("일정이 수정되었습니다!");
      }

      calendarRef.current?.refreshEvents(); // 일정 새로고침
      setIsModalOpen(false);
    } catch (error) {
      console.error("일정 저장/수정 실패:", error);
      alert("일정을 저장/수정하는 데 실패했습니다.");
    }
  };

  /* 삭제 핸들러 */
  const handleDeleteEvent = async () => {
    if (selectedEvent && selectedEvent.id) {
      try {
        await deleteSchedule(selectedEvent.id);
        alert("일정이 삭제되었습니다!");
        calendarRef.current?.refreshEvents(); // 일정 새로고침
        setIsModalOpen(false);
      } catch (error) {
        console.error("일정 삭제 실패:", error);
        alert("일정을 삭제하는 데 실패했습니다.");
      }
    }
  };

  /* 사이드바 토글 핸들러 */
  const handleLogoClick = () => {
    setSidebarVisible(!isSidebarVisible);
    setTimeout(() => {
      calendarRef.current?.updateSize();
    }, 300);
  };

  return (
    <div className="container">
      {/* 사이드바 */}
      <div className={`sidebar ${isSidebarVisible ? '' : 'hidden'}`}>
        <Sidebar />
      </div>

      {/* 메인 콘텐츠 */}
      <div className={`mainContent ${isSidebarVisible ? '' : 'expanded'}`}>
        <Header onLogoClick={handleLogoClick} />
        <div className="centerContainer">
          <div className="centerbox">
            <div className="centercard">
              <Calendar
                onEventClick={handleEventClick}
                ref={calendarRef}
              />
            </div>
          </div>
          {/* RightSidebar 분리 */}
          <RightSidebar onAddButtonClick={handleAddButtonClick} />
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
                startDate: typeof selectedEvent.start === "string"
                  ? selectedEvent.start
                  : selectedEvent.start.toISOString().split("T")[0],
                endDate: typeof selectedEvent.end === "string"
                  ? selectedEvent.end
                  : selectedEvent.end?.toISOString().split("T")[0] || "",
                startTime: typeof selectedEvent.start === "string"
                  ? selectedEvent.start.split("T")[1]?.slice(0, 5) || ""
                  : "",
                endTime: typeof selectedEvent.end === "string"
                  ? selectedEvent.end.split("T")[1]?.slice(0, 5) || ""
                  : "",
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
