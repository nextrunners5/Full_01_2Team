import React, { useEffect, useState } from 'react';
import './css/rightSidebar.css';
import { fetchSchedules } from '../../pages/axios/ScheduleAxios';

/* 일정 데이터 타입 */
interface Schedule {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  description?: string;
}

/* Props 타입 */
interface RightSidebarProps {
  onAddButtonClick: () => void;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ onAddButtonClick }) => {
  const [weekSchedules, setWeekSchedules] = useState<Schedule[]>([]);

  /* 날짜 포맷 함수 */
  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  };

  /* 일정 불러오기 및 필터링 */
  useEffect(() => {
    const loadSchedules = async () => {
      try {
        const allSchedules = await fetchSchedules();
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);

        // 일주일 이내 일정 필터링
        const filteredSchedules = allSchedules.filter((schedule: Schedule) => {
          const scheduleStart = new Date(schedule.startDate);
          return scheduleStart >= today && scheduleStart <= nextWeek;
        });

        // 일정 정렬 (시작 날짜 기준)
        filteredSchedules.sort((a: Schedule, b: Schedule) => {
          const dateA = new Date(a.startDate).getTime();
          const dateB = new Date(b.startDate).getTime();
          return dateA - dateB;
        });

        setWeekSchedules(filteredSchedules);
      } catch (error) {
        console.error('Failed to load schedules:', error);
      }
    };

    loadSchedules();
  }, []);

  return (
    <div className="rightSidebar">
      {/* 상단 Today 영역 */}
      <div className="dateContainer">
        <p>
          Today <br /> {new Date().toLocaleDateString()}
        </p>
        <button className="styled-button" onClick={onAddButtonClick}>
          + 일정
        </button>
      </div>

      {/* 일정 카드 목록 */}
      <div className="cardContainer">
        {weekSchedules.length > 0 ? (
          weekSchedules.map((schedule) => (
            <div key={schedule.id} className="card">
              <div className="cardHeader">
                <span>
                  {formatDate(schedule.startDate)} ~ {formatDate(schedule.endDate)}
                </span>
              </div>
              <div className="cardBody">
                <p>{schedule.title}</p>
              </div>
              <div className="cardFooter">
                <p>{schedule.description || '설명 없음'}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="noSchedule">이번 주에 예정된 일정이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
