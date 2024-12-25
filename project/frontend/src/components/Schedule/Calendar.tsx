import React, { useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ko from '@fullcalendar/core/locales/ko';
import { fetchSchedules } from '../../pages/axios/ScheduleAxios';
import './css/Calendar.css';

/* 이벤트 인터페이스 */
interface Event {
  id: string;
  title: string;
  start: string;
  starttime: string;
  end: string;
  endtime: string;
  description?: string;
}

/* Props 타입 */
interface CalendarProps {
  onEventClick: (event: Event) => void;
}

/* ForwardRef를 사용하여 캘린더 API 접근 */
const Calendar = forwardRef(({ onEventClick }: CalendarProps, ref) => {
  const calendarRef = useRef<FullCalendar>(null);
  const [events, setEvents] = React.useState<Event[]>([]);

  /* 날짜 및 시간 변환 함수 */
  const formatDateTime = (date: string, time: string): string => {
    const [hours, minutes] = time.split(':');
    const formattedDate = new Date(date);

    formattedDate.setHours(parseInt(hours, 10));
    formattedDate.setMinutes(parseInt(minutes, 10));

    return formattedDate.toISOString();
  };

  /* 일정 데이터 불러오기 */
  const loadSchedules = async () => {
    try {
      const data = await fetchSchedules();
      const schedules = Array.isArray(data) ? data : data.data;

      if (!Array.isArray(schedules)) {
        throw new Error("API 응답 형식이 잘못되었습니다.");
      }

      const formattedEvents = schedules.map((event: any) => ({
        id: String(event.id),
        title: event.title,
        start: formatDateTime(event.startDate, event.startTime),
        starttime: event.startTime,
        end: formatDateTime(event.endDate, event.endTime),
        endtime: event.endTime,
        description: event.details || '',
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error('캘린더 데이터 불러오기 오류:', error);
    }
  };

  useEffect(() => {
    loadSchedules();
  }, []);

  /* Ref를 통해 캘린더 API 접근 */
  useImperativeHandle(ref, () => ({
    updateSize: () => {
      calendarRef.current?.getApi().updateSize();
    },
    refreshEvents: async () => {
      await loadSchedules();
      calendarRef.current?.getApi().refetchEvents();
    },
  }));

  /* 이벤트 클릭 핸들러 */
  const handleEventClick = (info: any) => {
    const clickedEvent = {
      id: String(info.event.id),
      title: info.event.title,
      start: info.event.start?.toISOString() || '',
      starttime: info.event.start?.toLocaleTimeString('en-GB') || '',
      end: info.event.end?.toISOString() || '',
      endtime: info.event.end?.toLocaleTimeString('en-GB') || '',
      description: info.event.extendedProps.description || '',
    };

    onEventClick(clickedEvent);
  };

  return (
    <FullCalendar
      ref={calendarRef}
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events}
      locale={ko}
      timeZone="local"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      }}
      dayMaxEvents={3}
      dayMaxEventRows={true}
      eventClick={handleEventClick}
    />
  );
});

export default Calendar;
