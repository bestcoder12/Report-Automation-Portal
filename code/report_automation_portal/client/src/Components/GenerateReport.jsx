/* eslint-disable no-unused-vars */
import { useState, useMemo, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import ResSideBar from './SideBar.jsx';
import DropDownMenu from './DropDownMenu.jsx';
import getReportData from './GetData.js';
import getReportFile from './GetReportFile.js';
import DispTable from './DispTable.jsx';
import './LayoutReportStyle.css';

export default function GenerateReport() {
  const [value, onChange] = useState(new Date());
  const [reportCols, setReportCols] = useState();
  const [reportData, setReportData] = useState();
  const [responseMesg, setResponseMesg] = useState();

  useEffect(() => {
    setResponseMesg('');
  }, []);

  const columns = useMemo(() => reportCols, [reportCols]);
  const data = useMemo(() => reportData, [reportData]);

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

    const genDate = `${value.getFullYear()}-${(value.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${value.getDate().toString().padStart(2, '0')}`;
    const genData = {
      type: reportType,
      date: genDate,
      sessn: reportSession,
    };
    const response = await getReportData(genData);
    if (response.statusCode !== 200) {
      setResponseMesg(response.data.message);
    }
    // setReportData(response.data);
    let colObj;
    const colArr = [];
    for (let idx = 0; idx < response.data.metaData.headers.length; idx += 1) {
      colObj = {
        Header: response.data.metaData.headers[idx],
        accessor: response.data.metaData.columns[idx + 1],
      };
      colArr.push(colObj);
    }
    setReportCols(colArr);
    setReportData(response.data.rows);
  };

  const downloadExcelReport = async () => {
    const genDate = `${value.getFullYear()}-${(value.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${value.getDate().toString().padStart(2, '0')}`;
    const response = await getReportFile({
      type: reportType,
      date: genDate,
      sessn: reportSession,
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'file.xlsx');
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="report-container">
      <div className="sidebar">
        <ResSideBar />
      </div>
      <div className="page-container">
        <h1 className="heading">Generate Report</h1>
        {responseMesg && <p className="error">{responseMesg}</p>}
        <div className="report-form" style={{ maxHeight: '450px' }}>
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
            <button
              type="button"
              className="form-button"
              onClick={downloadExcelReport}
            >
              Download report as Excel
            </button>
          </div>
          <div className="report-child report-calendar">
            <div className="cal-label">Select date of report</div>
            <Calendar onChange={onChange} value={value} />
          </div>
        </div>
        <div className="report-table-container">
          {reportData ? (
            <DispTable columns={columns} data={data} cssClass="table" />
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}
