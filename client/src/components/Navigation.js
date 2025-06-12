import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';

const Nav = styled.nav`
  background-color: #2c3e50;
  padding: 1rem;
  color: white;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1rem;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #34495e;
  }
`;

const Button = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #34495e;
  }
`;

function Navigation() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">Biblioteka</Logo>
        <NavLinks>
          {user ? (
            <>
              <NavLink to="/my-books">Moje książki</NavLink>
              <NavLink to="/profile">Profil</NavLink>
              <Button onClick={handleLogout}>Wyloguj</Button>
            </>
          ) : (
            <>
              <NavLink to="/login">Logowanie</NavLink>
              <NavLink to="/register">Rejestracja</NavLink>
            </>
          )}
        </NavLinks>
      </NavContainer>
    </Nav>
  );
}

export default Navigation; 