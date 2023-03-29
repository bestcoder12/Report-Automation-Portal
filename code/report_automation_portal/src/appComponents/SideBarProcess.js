import React from 'react'
import { Link } from 'react-router-dom'
import styled from "styled-components";

const SidebarLink = styled(Link)`
  display: flex;
  color: white;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  list-style: none;
  height: 60px;
  text-decoration: none;
  font-size: 18px;
 
  &:hover {
    background: #252831;
    border-left: 4px solid light-blue;
    cursor: pointer;
  }
`;

const SidebarText = styled.span`
  margin-left: 16px;
`;

export const SideBarProcess = ({ menuopt }) => {
  return (
    <>
        <SidebarLink to={menuopt.path}>
            <div>
            {menuopt.icon}
            <SidebarText>{menuopt.title}</SidebarText>
            </div>
        </SidebarLink>
    </>
  );
}
