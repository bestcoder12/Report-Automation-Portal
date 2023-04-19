import { useState } from 'react';
import Calendar from 'react-calendar';
import SideBar from './SideBar.jsx';
import 'react-calendar/dist/Calendar.css';

export default function AddReport() {
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
}
