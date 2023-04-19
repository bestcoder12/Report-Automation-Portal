import { useMemo, useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { IconContext } from 'react-icons';
import { Link } from 'react-router-dom';
import SidebarContent from './SidebarContent.jsx';
import SideBarProcess from './SideBarProcess.jsx';

export default function SideBar() {
  const [sidebar, setSidebar] = useState(toString(0));

  const toggleSidebar = () => {
    setSidebar(!sidebar);
    const sidebarNav = document.getElementById('sidebar-nav');
    if (sidebar) {
      sidebarNav.style.left = '0';
    } else {
      sidebarNav.style.left = '-100%';
    }
  };

  const colorProvider = useMemo(() => ({ color: '#fff' }), []);

  return (
    <IconContext.Provider value={colorProvider}>
      <nav id="page-nav">
        <Link to="/#" id="sidebar-icon">
          <FaIcons.FaBars
            id="toggle-bars"
            data-testid="hamIcon"
            onClick={toggleSidebar}
          />
        </Link>
        <h1 style={{ textAlign: 'center', marginLeft: '65vh', color: 'white' }}>
          Report Automation Portal
        </h1>
      </nav>
      <nav id="sidebar-nav">
        <div id="sidebar-wrap">
          <Link to="/#" id="sidebar-icon">
            <AiIcons.AiOutlineClose
              data-testid="close-icon"
              onClick={toggleSidebar}
            />
          </Link>
          {
            /* SidebarContent.map((item, index) => {
                return <SubMenu item={item} key={index} />;
              }) */
            SidebarContent.map((menuOption) => (
              <SideBarProcess key={menuOption.title} menuopt={menuOption} />
            ))
          }
        </div>
      </nav>
    </IconContext.Provider>
  );
}
