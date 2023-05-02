import ResSideBar from './SideBar.jsx';

export default function Dashboard() {
  return (
    <div className="report-container">
      <div className="sidebar">
        <ResSideBar />
      </div>
      <div
        className="page-container"
        style={{ textAlign: 'center', fontSize: '28px', margin: '40vh' }}
      >
        Welcome to the Report Automation Portal
      </div>
    </div>
  );
}
