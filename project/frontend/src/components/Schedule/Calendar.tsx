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
    if (!date || !time) {
      console.error("Invalid date or time value:", { date, time });
      return new Date().toISOString();
    }
  
    const [hours, minutes] = time.split(':');
    const formattedDate = new Date(date);
  
    if (isNaN(formattedDate.getTime())) {
      console.error("Invalid date format:", date);
      return new Date().toISOString();
    }
  
    if (!hours || !minutes || isNaN(Number(hours)) || isNaN(Number(minutes))) {
      console.error("Invalid time format:", time);
      return formattedDate.toISOString();
    }
  
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
  
      const formattedEvents: Event[] = schedules
        .filter((event: any) => event.startDate && event.startTime && event.endDate && event.endTime) // 유효성 검사
        .map((event: any) => ({
          id: event.id ? String(event.id) : '',
          title: event.title || '제목 없음',
          start: formatDateTime(event.startDate, event.startTime),
          starttime: event.startTime || '',
          end: formatDateTime(event.endDate, event.endTime),
          endtime: event.endTime || '',
          description: event.description || '설명 없음',
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
  if (!info || !info.event) {
    console.error('클릭된 이벤트 정보가 없습니다.');
    return;
  }

  const startTime = info.event.start
    ? info.event.start.toISOString()
    : '';
  
  const endTime = info.event.end
    ? info.event.end.toISOString()
    : new Date(new Date(info.event.start).getTime() + 60 * 60 * 1000).toISOString(); // 시작 시간 +1시간

  const clickedEvent = {
    id: String(info.event.id || ''),
    title: info.event.title || '제목 없음',
    start: startTime,
    starttime: info.event.start
      ? info.event.start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      : '',
    end: endTime,
    endtime: info.event.end
      ? info.event.end.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      : new Date(new Date(info.event.start).getTime() + 60 * 60 * 1000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    description: info.event.extendedProps?.description || '설명 없음',
  };

  console.log('Clicked Event:', clickedEvent);

  if (!clickedEvent.start || !clickedEvent.end) {
    console.error('이벤트의 시작 시간 또는 종료 시간이 잘못되었습니다.');
    return;
  }

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
      dayMaxEventRows={1}
      eventColor="#6F42C1"
      eventClick={handleEventClick}
    />
  );
});

export default Calendar;
