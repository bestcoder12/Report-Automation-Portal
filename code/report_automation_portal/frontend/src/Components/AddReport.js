import React, { useState } from 'react';
import { SideBar } from './SideBar';
import Calendar from 'react-calendar';
import '../../node_modules/react-calendar/dist/Calendar.css';

export const AddReport = () => {
  const [value, onChange] = useState(new Date());
  return (
    <>
      <SideBar />
      <div>Add Report</div>
      <div style={{ margin: '10vh' }}>
        <Calendar onChange={onChange} value={value} />
      </div>
    </>
  );
};
