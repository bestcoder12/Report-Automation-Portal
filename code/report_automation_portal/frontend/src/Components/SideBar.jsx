import {
  Sidebar,
  Menu,
  MenuItem,
  useProSidebar,
  SubMenu,
} from 'react-pro-sidebar';
import { useMemo, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconContext } from 'react-icons';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as HiIcons from 'react-icons/hi2';
import * as MdIcons from 'react-icons/md';
import UserContext from './UserContext.jsx';
import clrSessn from './ClrSessn.js';

export default function ResSideBar() {
  const { collapseSidebar, collapsed } = useProSidebar();

  const value = useContext(UserContext);
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, setUserType } = value;

  const userLogout = async (e) => {
    e.preventDefault();
    setCurrentUser(null);
    setUserType(null);
    await clrSessn();
    return navigate('/');
  };

  return (
    <IconContext.Provider value={useMemo(() => ({ color: '#fff' }), [])}>
      <Sidebar
        className="sidebar-text"
        style={{
          display: 'flex',
          height: '100vh',
          backgroundColor: '#1a66ff',
        }}
      >
        <Menu>
          <MenuItem
            icon={collapsed ? <FaIcons.FaBars /> : <AiIcons.AiOutlineClose />}
            onClick={() => {
              collapseSidebar();
            }}
            className="sidebar-link toggle-icons sidebar-icon .sidebar-link:hover"
          >
            {' '}
            {currentUser ? <h3>Hi, {currentUser} </h3> : ''}
          </MenuItem>
          <MenuItem
            icon={<AiIcons.AiFillHome />}
            component={<Link to="/dashboard" />}
            className="sidebar-link sidebar-icon .sidebar-link:hover"
          >
            Dashboard
          </MenuItem>
          <SubMenu
            label="Reports"
            icon={<HiIcons.HiDocument />}
            className="sidebar-link sidebar-icon .sidebar-link:hover"
            style={{ backgroundColor: '#b7cdfb' }}
          >
            <MenuItem
              icon={<HiIcons.HiDocumentArrowUp />}
              component={<Link to="/addreport" />}
              className="sidebar-link sidebar-icon .sidebar-link:hover"
              style={{ backgroundColor: '#b7cdfb' }}
            >
              Add Report
            </MenuItem>
            <MenuItem
              icon={<MdIcons.MdEditDocument />}
              component={<Link to="/editreport" />}
              className="sdebar-link sidebar-icon .sidebar-link:hover"
              style={{ backgroundColor: '#b7cdfb' }}
            >
              Edit Report
            </MenuItem>
            <MenuItem
              icon={<HiIcons.HiDocumentArrowUp />}
              component={<Link to="/generatereport" />}
              className="sidebar-link sidebar-icon .sidebar-link:hover"
              style={{ backgroundColor: '#b7cdfb' }}
            >
              Generate Report
            </MenuItem>
          </SubMenu>
          <MenuItem
            icon={<FaIcons.FaUsersCog />}
            component={<Link to="/manageusers" />}
            className="sidebar-link sidebar-icon .sidebar-link:hover"
          >
            Manage Users
          </MenuItem>
          <MenuItem
            icon={<MdIcons.MdPassword />}
            component={<Link to="/changepassword" />}
            className="sidebar-link sidebar-icon .sidebar-link:hover"
          >
            Change Password
          </MenuItem>
          <MenuItem
            icon={<MdIcons.MdLogout />}
            onClick={userLogout}
            className="sidebar-link sidebar-icon .sidebar-link:hover"
          >
            Logout
          </MenuItem>
        </Menu>
      </Sidebar>
    </IconContext.Provider>
  );
}
