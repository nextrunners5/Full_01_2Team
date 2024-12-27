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
  scheduleUpdated: boolean; // 업데이트 상태를 감지
}

const RightSidebar: React.FC<RightSidebarProps> = ({ onAddButtonClick, scheduleUpdated }) => {
  const [todaySchedules, setTodaySchedules] = useState<Schedule[]>([]);
  const [weeklySchedules, setWeeklySchedules] = useState<Schedule[]>([]);

  /* 날짜 포맷 함수 */
  const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  /* 오늘의 일정과 일주일 이내 일정 불러오기 및 필터링 */
  const loadSchedules = async () => {
    try {
      const allSchedules = await fetchSchedules();
      const today = new Date();
      const nextWeek = new Date();
      nextWeek.setDate(today.getDate() + 7);

      // 오늘의 일정 필터링
      const todayFiltered = allSchedules.filter((schedule: Schedule) => {
        const scheduleStart = new Date(schedule.startDate).toDateString();
        return scheduleStart === today.toDateString();
      });

      todayFiltered.sort((a: Schedule, b: Schedule) => {
        const timeA = new Date(`${a.startDate}T${a.startTime}`).getTime();
        const timeB = new Date(`${b.startDate}T${b.startTime}`).getTime();
        return timeA - timeB;
      });

      // 일주일 이내 일정 필터링
      const weeklyFiltered = allSchedules.filter((schedule: Schedule) => {
        const scheduleStart = new Date(schedule.startDate);
        return scheduleStart >= today && scheduleStart <= nextWeek;
      });

      weeklyFiltered.sort((a: Schedule, b: Schedule) => {
        const dateA = new Date(a.startDate).getTime();
        const dateB = new Date(b.startDate).getTime();
        return dateA - dateB;
      });

      setTodaySchedules(todayFiltered);
      setWeeklySchedules(weeklyFiltered);
    } catch (error) {
      console.error('Failed to load schedules:', error);
    }
  };

  /* 일정 리렌더링을 감지하여 데이터 불러오기 */
  useEffect(() => {
    loadSchedules();
  }, [scheduleUpdated]);

  return (
    <div className="rightSidebar">
      {/* 상단 Today 영역 */}
      <div className="dateContainer">
        <p>
          오늘의 일정 <br /> {new Date().toLocaleDateString()}
        </p>
        <button className="styled-button" onClick={onAddButtonClick}>
          + 일정
        </button>
      </div>

      {/* 오늘의 일정 카드 목록 */}
      <div className="cardContainer">
        {todaySchedules.length > 0 ? (
          todaySchedules.map((schedule) => (
            <div key={schedule.id} className="card">
              <div className="cardHeader">
                <span>
                  <i className="fa-regular fa-calendar-days"></i> {schedule.title}
                  <br />
                  <p>
                    {schedule.startTime} ~ {schedule.endTime}
                  </p>
                </span>
              </div>
              <div className="cardBody"></div>
              <div className="cardFooter">
                <p>{schedule.description || '설명 없음'}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="noSchedule">오늘 예정된 일정이 없습니다.</p>
        )}
      </div>

      {/* 일주일 이내 일정 */}
      <div className="extraContainer">
        <h3>다가오는 일정</h3>
        {weeklySchedules.length > 0 ? (
          <ul className="weeklyScheduleList">
            {weeklySchedules.map((schedule) => (
              <li key={schedule.id} className="weeklyScheduleItem">
                <div className="weeklyScheduleDot"></div>
                <div>
                  <strong>{schedule.title}</strong>
                  <p>
                    {formatDate(schedule.startDate)} {schedule.startTime}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="noWeeklySchedule">일주일 내 예정된 일정이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default RightSidebar;
