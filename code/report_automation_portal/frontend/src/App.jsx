import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Login } from './Components/Login';
import { Dashboard } from './Components/Dashboard';
import { AddReport } from './Components/AddReport';
import { EditReport } from './Components/EditReport';
import { ManageUsers } from './Components/ManageUsers';
import { ChangePassword } from './Components/ChangePassword';
import { Logout } from './Components/Logout';

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
