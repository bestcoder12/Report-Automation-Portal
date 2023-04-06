import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
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
          <Route path="/login" element={<Login />}>
          </Route>
          <Route path="/dashboard" element={<Dashboard />}>
          </Route>
          <Route path="/addReport" element={<AddReport />}>
          </Route>
          <Route path="/editReport" element={<EditReport/>}>
          </Route>
          <Route path="/manageUsers" element={<ManageUsers />}>
          </Route>
          <Route path="/ChangePassword" element={<ChangePassword />}>
          </Route>
          <Route path="/logout" element={<Logout />}>
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
