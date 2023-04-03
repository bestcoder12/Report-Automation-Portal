import React, { useState } from 'react';
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { SidebarContent } from "./SidebarContent";
import { IconContext } from 'react-icons';
import { Link } from 'react-router-dom';
import { SideBarProcess } from './SideBarProcess';

export const SideBar = () => {

  const [sidebar, setSidebar] = useState("false");

  const toggleSidebar = () => {
    setSidebar(!sidebar)    
    let sidebarNav = document.getElementById('sidebar-nav');
    sidebar ? sidebarNav.style.left = '0' : sidebarNav.style.left = '-100%'
  };


  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <nav id='page-nav'>
              <Link to="#" id='sidebar-icon'>
                <FaIcons.FaBars id="toggle-bars" onClick={toggleSidebar} />
              </Link>
              <h1
                style={{ textAlign: "center",
                        marginLeft: "65vh",
                        color: "white" }}
              >
                Report Automation Portal
              </h1>
        </nav>
        <nav id='sidebar-nav' sidebar={sidebar}>
            <div id='sidebar-wrap'>
              <Link to="#" id='sidebar-icon'>
                <AiIcons.AiOutlineClose onClick={toggleSidebar} />
              </Link>
              {/* SidebarContent.map((item, index) => {
                return <SubMenu item={item} key={index} />;
              }) */
                  SidebarContent.map((menuOption)=>{
                    return <SideBarProcess menuopt={menuOption} />
                  })
              }
            </div>
          </nav>
      </IconContext.Provider>
    </>
  )
}
