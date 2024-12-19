// ScheduleContent.tsx
import React from 'react';

interface ScheduleContentProps {
  title: string;
  date: string;
}

const ScheduleContent: React.FC<ScheduleContentProps> = ({ title, date }) => {
  return (
    <div className="schedule-content">
      <h2>{title}</h2>
      <p>{date}</p>
    </div>
  );
};

export default ScheduleContent;