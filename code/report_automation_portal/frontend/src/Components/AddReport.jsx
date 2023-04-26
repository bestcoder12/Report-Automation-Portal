import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import sendFile from './SendFile.js';
import ResSideBar from './SideBar.jsx';
import DropDownMenu from './DropDownMenu.jsx';
import './LayoutReportStyle.css';

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
    <div className="report-container">
      <div className="sidebar">
        <ResSideBar />
      </div>
      <div className="page-container">
        <h1 className="heading">Add Report</h1>
        <div className="report-form">
          <div className="report-child">
            <form
              action=""
              method="POST"
              encType="multipart/form-data"
              onSubmit={uploadFile}
              className="report-child"
            >
              <DropDownMenu
                domFor="up-report-type"
                domLabelId="upld-type-label"
                label="Select type of report"
                options={reportOptions}
                value={reportType}
                onChange={handleReportType}
              />
              <DropDownMenu
                domFor="up-report-sessn"
                domLabelId="upld-sessn-label"
                label="Select session of report"
                options={sessionOptions}
                value={reportSession}
                onChange={handleReportSession}
              />
              <input
                type="file"
                name="xlsx"
                id="file-button"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={handleFile}
              />
              <button type="submit" className="form-button">
                Upload report
              </button>
            </form>
          </div>
          <div className="report-child report-calendar">
            <div className="cal-label">Select date of report</div>
            <Calendar onChange={onChange} value={value} />
          </div>
        </div>
      </div>
    </div>
  );
}
