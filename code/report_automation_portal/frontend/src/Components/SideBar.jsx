import { Sidebar, Menu, MenuItem, useProSidebar } from 'react-pro-sidebar';
import { useMemo } from 'react';
import { IconContext } from 'react-icons';
import * as FaIcons from 'react-icons/fa';
/* import * as AiIcons from 'react-icons/ai';
import * as HiIcons from 'react-icons/hi2';
import * as MdIcons from 'react-icons/md'; */

export default function ResSideBar() {
  const { collapseSidebar } = useProSidebar();

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <IconContext.Provider value={useMemo(() => ({ color: '#fff' }), [])}>
        <Sidebar>
          <Menu>
            <MenuItem
              icon={<FaIcons.FaBars />}
              onClick={() => {
                collapseSidebar();
              }}
            />
            <MenuItem>Dashboard</MenuItem>
            <MenuItem>Add Report</MenuItem>
            <MenuItem>Edit Report</MenuItem>
            <MenuItem>Manage Users</MenuItem>
            <MenuItem>Change Password</MenuItem>
            <MenuItem>Logout</MenuItem>
          </Menu>
        </Sidebar>
      </IconContext.Provider>
    </div>
  );
}
