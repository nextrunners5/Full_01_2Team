// 일정 페이지
import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import ScheduleContent from "../components/Schedule/ScheduleContent";
import Header from "../components/Header";
import Calendar from "../components/Schedule/Calendar";

const SchedulePage: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<{ title: string; date: string; description?: string } | null>(null);

  const handleEventClick = (event: { title: string; date: string; description?: string }) => {
    setSelectedEvent(event);
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Header />
      <div style={styles.mainContent}>
        <Sidebar />
        <div style={styles.centerContainer}>
        <Calendar userId="user123" onEventClick={handleEventClick} />
        {selectedEvent && (
        <ScheduleContent 
          title={selectedEvent.title} 
          date={selectedEvent.date}  
        />
      )}
        </div>
        <div style={styles.rightSidebar}>
          <p>오른쪽 사이드바 내용</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
  },
  mainContent: {
    display: "flex",
    flex: 1,
  },
  centerContainer: {
    width:"100%",
    minWidth: "50%",
    padding: "20px",
  },
  rightSidebar: {
    width: "250px",
    minWidth: "250px",
    backgroundColor: "#f0f0f0",
    padding: "20px",
  },
};

export default SchedulePage;
