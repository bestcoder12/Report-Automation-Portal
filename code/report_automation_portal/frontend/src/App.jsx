import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Login from './Components/Login.jsx';
import Dashboard from './Components/Dashboard.jsx';
import AddReport from './Components/AddReport.jsx';
import EditReport from './Components/EditReport.jsx';
import ManageUsers from './Components/ManageUsers.jsx';
import ChangePassword from './Components/ChangePassword.jsx';
import Logout from './Components/Logout.jsx';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/addReport" element={<AddReport />} />
          <Route path="/editReport" element={<EditReport />} />
          <Route path="/manageUsers" element={<ManageUsers />} />
          <Route path="/ChangePassword" element={<ChangePassword />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
