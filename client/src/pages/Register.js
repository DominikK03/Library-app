import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '@mui/material/styles';

const Container = styled.div`
  max-width: 420px;
  margin: 3rem auto;
  padding: 2.5rem 2rem 2rem 2rem;
  background: ${({ theme }) => theme.palette.background.paper};
  border-radius: 16px;
  box-shadow: 0 4px 24px 0 rgba(0,0,0,0.10);
  margin-top: 100px;
  transition: background 0.2s;
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.palette.mode === 'dark' ? theme.palette.primary.main : '#1976d2'};
  margin-bottom: 2.5rem;
  text-align: center;
  font-size: 2.1rem;
  font-weight: 700;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Input = styled.input`
  padding: 1rem;
  border: 1.5px solid #bfc9d1;
  border-radius: 6px;
  font-size: 1.08rem;
  background: ${({ theme }) => theme.palette.mode === 'dark' ? '#23272f' : '#f7fafd'};
  color: ${({ theme }) => theme.palette.text.primary};
  transition: border-color 0.2s, background 0.2s, color 0.2s;

  &:focus {
    outline: none;
    border-color: #1976d2;
    background: ${({ theme }) => theme.palette.background.paper};
  }
`;

const Button = styled.button`
  padding: 0.9rem;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.08rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
  box-shadow: 0 2px 8px 0 rgba(25, 118, 210, 0.08);
  transition: background-color 0.2s;

  &:hover {
    background-color: #115293;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin-top: 1rem;
  text-align: center;
  font-size: 1.05rem;
`;

const LoginLink = styled(Link)`
  display: block;
  text-align: center;
  margin-top: 2.5rem;
  color: #1976d2;
  text-decoration: none;
  font-weight: 500;
  font-size: 1.05rem;

  &:hover {
    text-decoration: underline;
  }
`;

function Register() {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    surname: '',
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Wystąpił błąd podczas rejestracji');
    }
  };

  return (
    <Container theme={theme}>
      <Title theme={theme}>Rejestracja</Title>
      <Form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          placeholder="Imię"
          value={formData.name}
          onChange={handleChange}
          required
          theme={theme}
        />
        <Input
          type="text"
          name="surname"
          placeholder="Nazwisko"
          value={formData.surname}
          onChange={handleChange}
          required
          theme={theme}
        />
        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          theme={theme}
        />
        <Input
          type="password"
          name="password"
          placeholder="Hasło"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={6}
          theme={theme}
        />
        <Button type="submit">Zarejestruj się</Button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Form>
      <LoginLink to="/login" style={{ marginTop: '2rem' }}>
        Masz już konto? Zaloguj się
      </LoginLink>
    </Container>
  );
}

export default Register;
