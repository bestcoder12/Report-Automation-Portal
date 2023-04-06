import React from 'react'
import { Link } from 'react-router-dom'
import './LayoutSidebar.css'

export const SideBarProcess = ({ menuopt, menukey }) => {
  return (
    <>
        <Link to={menuopt.path} id='sidebar-link'>
            <div key={menukey}>
            {menuopt.icon}
            <span id='sidebar-text'>{menuopt.title}</span>
            </div>
        </Link>
    </>
  );
}
