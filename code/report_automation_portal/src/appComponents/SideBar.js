import React, { useState } from 'react';
import styled from "styled-components";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import { SidebarContent } from "./SidebarContent";
import { IconContext } from 'react-icons';
import { Link } from 'react-router-dom';
import { SideBarProcess } from './SideBarProcess';

const Nav = styled.div`
  background: lightslategray;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const NavIcon = styled(Link)`
  margin-left: 2rem;
  font-size: 2rem;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`;

const SidebarNav = styled.nav`
  background: lightslategray;
  width: 250px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: ${({ sidebar }) => (sidebar ? "0" : "-100%")};
  transition: 350ms;
  z-index: 10;
`;

const SidebarWrap = styled.div`
  width: 100%;
`;

export const SideBar = () => {

  const [sidebar, setSidebar] = useState(false);
  const toggleSidebar = () => {setSidebar(!sidebar)};

  return (
    <>
      <IconContext.Provider value={{ color: "#fff" }}>
        <Nav>
              <NavIcon to="#">
                <FaIcons.FaBars id="toggle-bars" onClick={toggleSidebar} />
              </NavIcon>
              <h1
                style={{ textAlign: "center",
                        marginLeft: "200px",
                        color: "white" }}
              >
                Report Automation Portal
              </h1>
        </Nav>
        <SidebarNav sidebar={sidebar}>
            <SidebarWrap>
              <NavIcon to="#">
                <AiIcons.AiOutlineClose onClick={toggleSidebar} />
              </NavIcon>
              {/* SidebarContent.map((item, index) => {
                return <SubMenu item={item} key={index} />;
              }) */
                  SidebarContent.map((menuOption)=>{
                    return <SideBarProcess menuopt={menuOption} />
                  })
              }
            </SidebarWrap>
          </SidebarNav>
      </IconContext.Provider>
    </>
  )
}
