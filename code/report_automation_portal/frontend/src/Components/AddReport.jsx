import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import sendFile from './SendFile.js';
import ResSideBar from './SideBar.jsx';
import DropDownMenu from './DropDownMenu.jsx';
import './AddReportStyle.css';

export default function AddReport() {
  const [value, onChange] = useState(new Date());
  const [file, setFile] = useState();

  const reportOptions = [
    { label: 'OLT Monthly', value: 'olt-monthly' },
    { label: 'OLT Network Provider', value: 'olt-net-provider' },
  ];
  const [reportType, setReportType] = useState(reportOptions[0].value);

  const sessionOptions = [
    { label: '10 A.M.', value: '10am' },
    { label: '2 P.M.', value: '2pm' },
  ];
  const [reportSession, setReportSession] = useState(sessionOptions[0].value);

  const handleReportType = (e) => {
    setReportType(e.target.value);
  };

  const handleReportSession = (e) => {
    setReportSession(e.target.value);
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async (e) => {
    e.preventDefault();
    const upldDate = `${value.getFullYear()}-${
      value.getMonth() + 1
    }-${value.getDate()}`;
    const formData = new FormData();
    formData.append('date', upldDate);
    formData.append('type', reportType);
    formData.append('sessn', reportSession);
    formData.append('xlsx', file);
    const response = await sendFile(formData);
    console.log(response);
  };

  return (
    <div className="page">
      <ResSideBar />
      <h1 style={{ color: 'white', marginLeft: '5rem' }}>Add Report</h1>
      <div id="upload-form">
        <form action="" method="POST" onSubmit={uploadFile}>
          <DropDownMenu
            domFor="up-report-type"
            domLabelId="upld-type-label"
            domSelectId="upld-type-select"
            label="Select type of report"
            options={reportOptions}
            value={reportType}
            onChange={handleReportType}
          />
          <DropDownMenu
            domFor="up-report-sessn"
            domLabelId="upld-sessn-label"
            domSelectId="upld-sesn-select"
            label="Select session of report"
            options={sessionOptions}
            value={reportSession}
            onChange={handleReportSession}
          />
          <input
            type="file"
            name="xlsx"
            id="file-button"
            onChange={handleFile}
          />
          <button type="submit" className="form-button">
            Upload report
          </button>
        </form>
      </div>
      <div style={{ margin: '10vh' }}>
        <Calendar onChange={onChange} value={value} />
      </div>
    </div>
  );
}
