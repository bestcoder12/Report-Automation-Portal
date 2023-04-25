import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import ResSideBar from './SideBar.jsx';
import DropDownMenu from './DropDownMenu.jsx';
import getReportData from './GetData.js';
import './LayoutReportStyle.css';

export default function GenerateReport() {
  const [value, onChange] = useState(new Date());

  const reportOptions = [
    { label: 'OLT Status', value: 'olt-status' },
    { label: 'ONT Status', value: 'ont-status' },
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

  const getReport = async (e) => {
    e.preventDefault();

    const genDate = `${value.getFullYear()}-${
      value.getMonth() + 1
    }-${value.getDate()}`;
    const genData = {
      type: reportType,
      date: genDate,
      sessn: reportSession,
    };
    const response = await getReportData(genData);
    console.log(response);
  };

  return (
    <div className="report-container">
      <div className="sidebar">
        <ResSideBar />
      </div>
      <div className="page-container">
        <h1 className="heading">Generate Report</h1>
        <div className="report-form">
          <div className="report-child">
            <form
              action=""
              method="POST"
              onSubmit={getReport}
              className="report-child"
            >
              <DropDownMenu
                domFor="gn-report-type"
                domLabelId="gen-type-label"
                label="Select type of report"
                options={reportOptions}
                value={reportType}
                onChange={handleReportType}
              />
              <DropDownMenu
                domFor="up-report-sessn"
                domLabelId="gen-sessn-label"
                label="Select session of report"
                options={sessionOptions}
                value={reportSession}
                onChange={handleReportSession}
              />
              <button type="submit" className="form-button">
                Generate Report
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
