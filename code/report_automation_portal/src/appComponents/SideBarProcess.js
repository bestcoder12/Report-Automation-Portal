import React from 'react'
import { Link } from 'react-router-dom'
import './LayoutSidebar.css'

export const SideBarProcess = ({ menuopt }) => {
  return (
    <>
        <Link to={menuopt.path} id='sidebar-link'>
            <div>
            {menuopt.icon}
            <span id='sidebar-text'>{menuopt.title}</span>
            </div>
        </Link>
    </>
  );
}
