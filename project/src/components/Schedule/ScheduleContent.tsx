
import React from 'react';

const ScheduleContent: React.FC = () => {
  return (
    <div style={styles.content}>
      <h1>일정 페이지</h1>
      <p>여기에 일정 관련 내용 추가</p>
    </div>
  );
};

const styles = {
  content: {
    padding: '20px',
    flex: 1,
  },
};

export default ScheduleContent;

