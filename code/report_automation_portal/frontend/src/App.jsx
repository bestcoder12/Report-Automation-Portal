import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Axios from 'axios';
import { useMemo, useState } from 'react';
import './App.css';
import Login from './Components/Login.jsx';
import Dashboard from './Components/Dashboard.jsx';
import AddReport from './Components/AddReport.jsx';
import EditReport from './Components/EditReport.jsx';
import ManageUsers from './Components/ManageUsers.jsx';
import ChangePassword from './Components/ChangePassword.jsx';
import Logout from './Components/Logout.jsx';
import UserContext from './Components/UserContext.jsx';

function App() {
  Axios.defaults.withCredentials = true;
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [failLogin, setFailLogin] = useState(true);
  console.log(currentUser, userType, failLogin);
  return (
    <UserContext.Provider
      value={useMemo(
        () => ({
          currentUser,
          setCurrentUser,
          userType,
          setUserType,
          failLogin,
          setFailLogin,
        }),
        [currentUser, userType, failLogin]
      )}
    >
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
    </UserContext.Provider>
  );
}

export default App;
