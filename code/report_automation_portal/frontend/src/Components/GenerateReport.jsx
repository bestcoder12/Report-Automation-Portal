/* eslint-disable no-unused-vars */
import { useState, useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styled from 'styled-components';
import ResSideBar from './SideBar.jsx';
import DropDownMenu from './DropDownMenu.jsx';
import getReportData from './GetData.js';
import DispTable from './DispTable.jsx';
import './LayoutReportStyle.css';

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`;

export default function GenerateReport() {
  const [value, onChange] = useState(new Date());
  const [reportCols, setReportCols] = useState([
    { Headers: 'Foo', accessor: 'Bar' },
  ]);
  const [reportData, setReportData] = useState([{ Bar: 'FooBar' }]);

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

    const genDate = `${value.getFullYear()}-${
      value.getMonth() + 1
    }-${value.getDate()}`;
    const genData = {
      type: reportType,
      date: genDate,
      sessn: reportSession,
    };
    const response = await getReportData(genData);
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

  return (
    <div className="report-container">
      <div className="sidebar">
        <ResSideBar />
      </div>
      <div className="page-container">
        <h1 className="heading">Generate Report</h1>
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
          </div>
          <div className="report-child report-calendar">
            <div className="cal-label">Select date of report</div>
            <Calendar onChange={onChange} value={value} />
          </div>
        </div>
        <div className="report-table-container">
          <Styles>
            <DispTable columns={columns} data={data} />
          </Styles>
        </div>
      </div>
    </div>
  );
}
