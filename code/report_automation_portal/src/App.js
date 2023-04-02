import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import './App.css';
import { Login } from './appComponents/Login';
import { Dashboard } from './appComponents/Dashboard';
import { AddReport } from './appComponents/AddReport';
import { EditReport } from './appComponents/EditReport';
import { ManageUsers } from './appComponents/ManageUsers';
import { ChangePassword } from './appComponents/ChangePassword';
import { Logout } from './appComponents/Logout';

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
