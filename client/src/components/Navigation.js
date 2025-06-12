import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Box from '@mui/material/Box';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useAuth } from '../contexts/AuthContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const Navigation = ({ darkMode, setDarkMode }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="fixed" color="primary" elevation={2}>
      <Toolbar>
        {/* Linki po lewej */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ color: 'inherit', textDecoration: 'none', fontWeight: 'bold', mr: 3 }}
          >
            Biblioteka
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <Button color="inherit" component={Link} to="/">Strona główna</Button>
            {user && <Button color="inherit" component={Link} to="/my-books">Moje książki</Button>}
            {user && <Button color="inherit" component={Link} to="/profile">Profil</Button>}
            {!user && <Button color="inherit" component={Link} to="/login">Zaloguj</Button>}
            {!user && <Button color="inherit" component={Link} to="/register">Rejestracja</Button>}
            {user && user.role === 'Librarian' && (
              <Button color="inherit" component={Link} to="/librarian">Panel bibliotekarza</Button>
            )}
            {user && user.role === 'Admin' && (
              <Button color="inherit" component={Link} to="/grant-role">Nadaj uprawnienia</Button>
            )}
          </Box>
          {/* Menu mobilne */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, ml: 1 }}>
            <IconButton size="large" color="inherit" onClick={handleMenu}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
              <MenuItem component={Link} to="/" onClick={handleClose}>Strona główna</MenuItem>
              {user && <MenuItem component={Link} to="/my-books" onClick={handleClose}>Moje książki</MenuItem>}
              {user && <MenuItem component={Link} to="/profile" onClick={handleClose}>Profil</MenuItem>}
              {!user && <MenuItem component={Link} to="/login" onClick={handleClose}>Zaloguj</MenuItem>}
              {!user && <MenuItem component={Link} to="/register" onClick={handleClose}>Rejestracja</MenuItem>}
              {user && <MenuItem onClick={() => { handleLogout(); handleClose(); }}>Wyloguj</MenuItem>}
              {user && user.role === 'Librarian' && (
                <MenuItem component={Link} to="/librarian" onClick={handleClose}>Panel bibliotekarza</MenuItem>
              )}
              {user && user.role === 'Admin' && (
                <MenuItem component={Link} to="/grant-role" onClick={handleClose}>Nadaj uprawnienia</MenuItem>
              )}
            </Menu>
          </Box>
        </Box>
        {/* Przełącznik trybu ciemnego i wyloguj po prawej */}
        {user && (
          <Button color="inherit" onClick={handleLogout} sx={{ mr: 1 }}>
            Wyloguj
          </Button>
        )}
        <IconButton sx={{ ml: 0 }} color="inherit" onClick={() => setDarkMode((prev) => !prev)}>
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
