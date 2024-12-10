// 일정 목록 컴포넌트

import React from "react";
import { Schedule } from "../../types/Schedule";

interface ScheduleListProps {
  schedules: Schedule[];
}

const ScheduleList: React.FC<ScheduleListProps> = ({ schedules }) => {
  return (
    <ul>
      {schedules.map((schedule) => (
        <li key={schedule.id}>
          {schedule.title} - {schedule.date}
        </li>
      ))}
    </ul>
  );
};

export default ScheduleList;
