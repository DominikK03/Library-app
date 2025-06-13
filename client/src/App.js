import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import BookDetails from './pages/BookDetails';
import Profile from './pages/Profile';
import MyBooks from './pages/MyBooks';
import LibrarianPanel from './pages/LibrarianPanel';
import GrantRole from './pages/GrantRole';
import ProtectedRoute from './components/ProtectedRoute';
import RedirectIfAuth from './components/RedirectIfAuth';
import LibrarianRoute from './components/LibrarianRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const theme = useMemo(() => createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      background: {
        default: darkMode ? '#181a1b' : '#f4f6fa',
        paper: darkMode ? '#23272f' : '#fff',
      },
    },
    shape: { borderRadius: 10 },
  }), [darkMode]);
  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Navigation darkMode={darkMode} setDarkMode={setDarkMode} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={
              <RedirectIfAuth>
                <Login />
              </RedirectIfAuth>
            } />
            <Route path="/register" element={
              <RedirectIfAuth>
                <Register />
              </RedirectIfAuth>
            } />
            <Route path="/books/:id" element={<BookDetails />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-books"
              element={
                <ProtectedRoute>
                  <MyBooks />
                </ProtectedRoute>
              }
            />
            <Route path="/librarian" element={
              <LibrarianRoute>
                <LibrarianPanel />
              </LibrarianRoute>
            } />
            <Route path="/grant-role" element={
              <ProtectedRoute>
                <GrantRole />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

