import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as HiIcons from 'react-icons/hi2';
import * as MdIcons from 'react-icons/md';

export const SidebarContent = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <AiIcons.AiFillHome />,
  },
  {
    title: 'Add Report',
    path: '/addReport',
    icon: <HiIcons.HiDocumentArrowUp />,
  },
  {
    title: 'Edit Report',
    path: '/editReport',
    icon: <MdIcons.MdEditDocument />,
  },
  {
    title: 'Manage Users',
    path: '/manageUsers',
    icon: <FaIcons.FaUsersCog />,
  },
  {
    title: 'Change Password',
    path: '/changePassword',
    icon: <MdIcons.MdPassword />,
  },
  {
    title: 'Logout',
    path: '/logout',
    icon: <MdIcons.MdLogout />,
  },
];
