// src/components/SchedulePage.tsx
import React from 'react';
import Sidebar from '../components/Sidebar';
import ScheduleContent from '../components/Schedule/ScheduleContent';

const SchedulePage: React.FC = () => {
  return (
    <div style={styles.container}>
      <Sidebar />
      <ScheduleContent />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh', // 전체 화면 높이
  },
};

export default SchedulePage;

