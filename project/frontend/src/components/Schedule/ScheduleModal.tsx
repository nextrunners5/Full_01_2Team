import React, { useRef, useState, useEffect } from "react";
import "./css/Modal.css";

/* Props 인터페이스 */
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
  onDelete?: () => void; // 삭제 핸들러 추가
  selectedEvent?: {
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    title: string;
    description?: string;
  } | null;
  mode: "add" | "edit";
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  selectedEvent,
  mode,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  /* 모드에 따른 초기값 설정 (수정 모드일 때만 초기화) */
  useEffect(() => {
    if (mode === "edit" && selectedEvent) {
      setStartDate(new Date(selectedEvent.startDate));
      setEndDate(new Date(selectedEvent.endDate));
      setStartTime(selectedEvent.startTime);
      setEndTime(selectedEvent.endTime);
      setTitle(selectedEvent.title);
      setDescription(selectedEvent.description || "");
    } else if (mode === "add") {
      setStartDate(null);
      setEndDate(null);
      setStartTime("");
      setEndTime("");
      setTitle("");
      setDescription("");
    }
  }, [selectedEvent, mode]);

  /* 모달 드래그 핸들러 */
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

  /* 저장 핸들러 */
  const handleSave = () => {
    onSave({ startDate, endDate, startTime, endTime, title, description });
    onClose();
  };

  /* 삭제 핸들러 */
  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  /* 날짜 변경 핸들러 */
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    setStartDate(date);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : null;
    setEndDate(date);
  };

  if (!isOpen) return null;

  return (
    <div className="overlay">
      <div ref={modalRef} className="modal" onMouseDown={handleMouseDown}>
        <div className="modalbox">
          <div className="header">
            <h2 className="title">{mode === "edit" ? "일정 수정" : "일정 추가"}</h2>
            <button onClick={onClose} className="closeButton">
              X
            </button>
          </div>
          <div className="inputContainer1">
            <div className="dateLabel">
              <h3 className="dateLabelTitle">시작 날짜</h3>
              <input
                type="date"
                value={startDate ? startDate.toISOString().split("T")[0] : ""}
                onChange={handleStartDateChange}
                className="dateInput"
              />
            </div>
            <div className="dateLabel">
              <h3 className="dateLabelTitle">종료 날짜</h3>
              <input
                type="date"
                value={endDate ? endDate.toISOString().split("T")[0] : ""}
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
            {mode === "edit" ? "수정" : "추가"}
          </button>
          <button onClick={onClose} className="cancelButton">
            취소
          </button>
          {mode === "edit" && (
            <button onClick={handleDelete} className="deleteButton">
              삭제
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
