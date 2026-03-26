import React, { useState } from "react";
import styled from "styled-components";
import LogoImg from "../Utils/Images/logo.png";
import { Link as LinkR, NavLink } from "react-router-dom";
import { MenuRounded, Brightness4, Brightness7 } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logout, toggleDarkMode } from "../redux/redusers/userSlice";

const Nav = styled.div`
  background-color: ${({ theme }) => theme.navbar};
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  position: sticky;
  top: 0;
  z-index: 10;
  color: white;
  border-bottom: 1px solid ${({ theme }) => theme.shadowMd};
  box-shadow: 0 2px 8px ${({ theme }) => theme.shadow};
  backdrop-filter: blur(8px);
`;
const NavContainer = styled.div`
  width: 100%;
  max-width: 1400px;
  padding: 0 24px;
  display: flex;
  gap: 14px;
  align-items: center;
  justify-content: space-between;
  font-size: 1rem;
`;
const NavLogo = styled(LinkR)`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 6px;
  font-weight: 700;
  font-size: 20px;
  text-decoration: none;
  color: ${({ theme }) => theme.text_primary};
  transition: all 0.3s ease;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;
const Logo = styled.img`
  height: 42px;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;
const Mobileicon = styled.div`
  color: ${({ theme }) => theme.text_primary};
  display: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
  
  @media screen and (max-width: 768px) {
    display: flex;
    align-items: center;
  }
`;

const NavItems = styled.ul`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 0 6px;
  list-style: none;

  @media screen and (max-width: 768px) {
    display: none;
  }
`;
const Navlink = styled(NavLink)`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.text_secondary};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  position: relative;
  padding: 8px 0;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
  
  &.active {
    color: ${({ theme }) => theme.primary};
    
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      right: 0;
      height: 3px;
      background: ${({ theme }) => theme.primary};
      border-radius: 2px;
    }
  }
`;

const UserContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  align-items: center;
  padding: 0 6px;
`;

const IconButton = styled.button`
  padding: 8px;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.text_secondary};
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  display: flex;
  align-items: center;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.primaryLight};
  }
`;

const TextButton = styled.div`
  text-align: end;
  color: ${({ theme }) => theme.text_secondary};
  cursor: pointer;
  font-size: 15px;
  transition: all 0.3s ease;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 6px;
  
  &:hover {
    color: ${({ theme }) => theme.primary};
    background: ${({ theme }) => theme.primaryLight};
  }
`;

const MobileMenu = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 16px;
  padding: 0 6px;
  list-style: none;
  width: 90%;
  padding: 12px 40px 24px 40px;
  background: ${({ theme }) => theme.card};
  position: absolute;
  top: 80px;
  right: 0;
  transition: all 0.6s ease-in-out;
  transform: ${({ isOpen }) =>
    isOpen ? "translateY(0)" : "translateY(-100%)"};
  border-radius: 0 0 20px 20px;
  box-shadow: 0 4px 12px ${({ theme }) => theme.shadowLg};
  opacity: ${({ isOpen }) => (isOpen ? "100%" : "0")};
  z-index: ${({ isOpen }) => (isOpen ? "1000" : "-1000")};
`;

const Navbar = ({ currentUser }) => {
  const dispatch = useDispatch();
  const { darkMode } = useSelector((state) => state.user);
  const [isOpen, setisOpen] = useState(false);
  
  return (
    <Nav>
      <NavContainer>
        <Mobileicon onClick={() => setisOpen(!isOpen)}>
          <MenuRounded sx={{ color: "inherit" }} />
        </Mobileicon>
        <NavLogo to="/">
          <Logo src={LogoImg} />
          Fittrack
        </NavLogo>

        <MobileMenu isOpen={isOpen}>
          <Navlink to="/">Dashboard</Navlink>
          <Navlink to="/workouts">Workouts</Navlink>
          <Navlink to="/goals">Goals</Navlink>
          <Navlink to="/profile">Profile</Navlink>
        </MobileMenu>

        <NavItems>
          <Navlink to="/">Dashboard</Navlink>
          <Navlink to="/workouts">Workouts</Navlink>
          <Navlink to="/goals">Goals</Navlink>
          <Navlink to="/profile">Profile</Navlink>
        </NavItems>

        <UserContainer>
          <IconButton onClick={() => dispatch(toggleDarkMode())}>
            {darkMode ? (
              <Brightness7 sx={{ fontSize: "20px" }} />
            ) : (
              <Brightness4 sx={{ fontSize: "20px" }} />
            )}
          </IconButton>
          <NavLink to="/profile" style={{ textDecoration: "none" }}>
            <Avatar 
              src={currentUser?.img} 
              sx={{ 
                cursor: "pointer",
                "&:hover": { opacity: 0.8 }
              }}
            >
              {currentUser?.name?.[0]}
            </Avatar>
          </NavLink>
          <TextButton onClick={() => dispatch(logout())}>Logout</TextButton>
        </UserContainer>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;
