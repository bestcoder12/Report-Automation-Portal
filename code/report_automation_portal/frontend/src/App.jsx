import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Axios from 'axios';
import { useMemo, useState } from 'react';
import './App.css';
// import Home from './Components/Home.jsx';
import Login from './Components/Login.jsx';
import Dashboard from './Components/Dashboard.jsx';
import AddReport from './Components/AddReport.jsx';
import EditReport from './Components/EditReport.jsx';
import GenerateReport from './Components/GenerateReport.jsx';
import ManageUsers from './Components/ManageUsers.jsx';
import ChangePassword from './Components/ChangePassword.jsx';
import Logout from './Components/Logout.jsx';
import UserContext from './Components/UserContext.jsx';
import RequireAuth from './Components/RequireAuth.jsx';

function App() {
  Axios.defaults.withCredentials = true;
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [failLogin, setFailLogin] = useState(null);
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
            {/* <Route path="/" element={<Home />}> */}
            <Route path="/" element={<Login />} />
            <Route element={<RequireAuth />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/addreport" element={<AddReport />} />
              <Route path="/editreport" element={<EditReport />} />
              <Route path="/generatereport" element={<GenerateReport />} />
              <Route path="/manageusers" element={<ManageUsers />} />
              <Route path="/changepassword" element={<ChangePassword />} />
              <Route path="/logout" element={<Logout />} />
            </Route>
            {/* </Route> */}
          </Routes>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
