import React, { useRef, useState } from "react";
import "./css/Modal.css";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: {
    startDate: Date | null;
    endDate: Date | null;
    startTime: string;
    endTime: string;
    title: string;
    description: string;
  }) => void;
  selectedEvent: {
    title: string;
    date: string;
    description?: string;
  } | null;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const handleMouseDown = (e: React.MouseEvent) => {
    const modal = modalRef.current;
    if (!modal) return;

    const offsetX = e.clientX - modal.getBoundingClientRect().left;
    const offsetY = e.clientY - modal.getBoundingClientRect().top;

    const handleMouseMove = (e: MouseEvent) => {
      modal.style.left = `${e.clientX - offsetX}px`;
      modal.style.top = `${e.clientY - offsetY}px`;
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({ startDate, endDate, startTime, endTime, title, description });
    onClose();
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    setStartDate(date);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    setEndDate(date);
  };

  return (
    <div className="overlay">
      <div ref={modalRef} className="modal" onMouseDown={handleMouseDown}>
        <div className="modalbox">
          <div className="header">
            <h2 className="title">일정 추가</h2>
            <button onClick={onClose} className="closeButton">
              X
            </button>
          </div>
          <div className="inputContainer1">
            <div className="dateLabel">
              <h3 className="dateLabelTitle">시작 날짜</h3>
              <input
                type="date"
                onChange={handleStartDateChange}
                className="dateInput"
              />
            </div>
            <div className="dateLabel">
              <h3 className="dateLabelTitle">종료 날짜</h3>
              <input
                type="date"
                onChange={handleEndDateChange}
                className="dateInput"
              />
            </div>
          </div>
          <div className="inputContainer2">
            <div className="timeLabel">
              <h3 className="timeLabelTitle">시작 시간</h3>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="timeInput"
              />
            </div>
            <div className="timeLabel">
              <h3 className="timeLabelTitle">종료 시간</h3>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="timeInput"
              />
            </div>
          </div>
          <div className="inputContainer">
            <h3 className="titleLabel">일정 제목</h3>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="titleInput"
              placeholder="일정 제목"
            />
          </div>
          <div className="inputContainer">
            <h3 className="descriptionLabel">일정 설명</h3>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="descriptionInput"
              placeholder="일정 설명"
            />
          </div>
        </div>
        <div className="buttonContainer">
          <button onClick={handleSave} className="addButton">
            추가
          </button>
          <button onClick={onClose} className="cancelButton">
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
