import React from 'react';
import { SideBar } from './SideBar';

export const Dashboard = () => {
  return (
    <>
      <SideBar />

      <div style={{ textAlign: 'center', fontSize: '28px', margin: '40vh' }}>
        Welcome to the Report Automation Portal
      </div>
    </>
  );
};
