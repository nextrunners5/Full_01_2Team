import React, { useEffect, useState } from "react";
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import ko from '@fullcalendar/core/locales/ko';
import './css/Calendar.css';

interface Event {
  title: string;
  date: string;
  description?: string;
}

interface CalendarProps {
  userId: string;
  onEventClick: (event: Event) => void;
}

const Calendar: React.FC<CalendarProps> = ({ userId }) => {
  const [events, setEvents] = useState<{ title: string; date: string }[]>([]);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`/api/userService/${userId}`);
        if (!response.ok) {
          throw new Error('네트워크 응답이 좋지 않습니다.');
        }
        const data = await response.json();
        
        const formattedEvents = data.map((event: { title: string; date: string }) => ({
          title: event.title,
          date: event.date,
        }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('일정 데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchEvents();
  }, [userId]);

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin]}
      initialView="dayGridMonth"
      events={events}
      locale={ko}
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      }}
    />
  );
};

export default Calendar;
