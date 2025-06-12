import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  color: #2c3e50;
  margin-bottom: 2rem;
`;

const InfoLabel = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.span`
  font-weight: bold;
  color: #2c3e50;
`;

const Button = styled.button`
  padding: 0.8rem 1.5rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;

  &:hover {
    background-color: #2980b9;
  }

  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  margin-top: 1rem;
`;

const SuccessMessage = styled.div`
  color: #2ecc71;
  margin-top: 1rem;
`;

const InfoSection = styled.div`
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
`;

const InfoValue = styled.div`
  color: #34495e;
  margin-bottom: 1rem;
`;

const MembershipId = styled.div`
  font-family: monospace;
  font-size: 1.2rem;
  color: #2c3e50;
  background-color: #ecf0f1;
  padding: 0.5rem;
  border-radius: 4px;
  margin: 1rem 0;
`;

const PasswordChangeSection = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const ToggleButton = styled(Button)`
  background-color: ${props => props.isOpen ? '#e74c3c' : '#3498db'};
  margin-bottom: 1rem;

  &:hover {
    background-color: ${props => props.isOpen ? '#c0392b' : '#2980b9'};
  }
`;

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phoneNumber: '',
    birthDate: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isPasswordFormOpen, setIsPasswordFormOpen] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/users/profile');
      setProfile(response.data);
      setFormData({
        name: response.data.name,
        surname: response.data.surname,
        phoneNumber: response.data.phoneNumber,
        birthDate: response.data.birthDate,
      });
    } catch (error) {
      setError('Nie udało się pobrać danych profilu');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(formData);
      setSuccess('Profil został zaktualizowany');
      setError('');
    } catch (err) {
      setError('Wystąpił błąd podczas aktualizacji profilu');
      setSuccess('');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Nowe hasła nie są identyczne');
      return;
    }
    try {
      await axios.post('http://localhost:5001/api/users/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccess('Hasło zostało zmienione');
      setError('');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setIsPasswordFormOpen(false);
    } catch (err) {
      setError('Wystąpił błąd podczas zmiany hasła');
      setSuccess('');
    }
  };

  if (loading) return <div>Ładowanie...</div>;
  if (!profile) return <div>Nie znaleziono profilu</div>;

  return (
    <Container>
      <Title>Profil użytkownika</Title>
      
      <InfoSection>
        <InfoLabel>Membership ID</InfoLabel>
        <MembershipId>{user._id}</MembershipId>
      </InfoSection>

      {!isEditing ? (
        <>
          <InfoLabel>
            <Label>Imię:</Label> {profile.name}
          </InfoLabel>
          <InfoLabel>
            <Label>Nazwisko:</Label> {profile.surname}
          </InfoLabel>
          <InfoLabel>
            <Label>Email:</Label> {profile.email}
          </InfoLabel>
          <InfoLabel>
            <Label>Numer telefonu:</Label> {profile.phoneNumber}
          </InfoLabel>
          <InfoLabel>
            <Label>Data urodzenia:</Label> {new Date(profile.birthDate).toLocaleDateString()}
          </InfoLabel>
          <Button onClick={() => setIsEditing(true)}>Edytuj profil</Button>
        </>
      ) : (
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="name"
            placeholder="Imię"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <Input
            type="text"
            name="surname"
            placeholder="Nazwisko"
            value={formData.surname}
            onChange={handleChange}
            required
          />
          <Input
            type="tel"
            name="phoneNumber"
            placeholder="Numer telefonu"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          <Input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            required
          />
          <Button type="submit">Zapisz zmiany</Button>
          <Button type="button" onClick={() => setIsEditing(false)}>
            Anuluj
          </Button>
        </Form>
      )}

      <PasswordChangeSection>
        <ToggleButton
          type="button"
          onClick={() => setIsPasswordFormOpen(!isPasswordFormOpen)}
          isOpen={isPasswordFormOpen}
        >
          {isPasswordFormOpen ? 'Anuluj zmianę hasła' : 'Zmień hasło'}
        </ToggleButton>

        {isPasswordFormOpen && (
          <Form onSubmit={handlePasswordSubmit}>
            <InfoLabel>Aktualne hasło</InfoLabel>
            <Input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
            />

            <InfoLabel>Nowe hasło</InfoLabel>
            <Input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
              minLength={6}
            />

            <InfoLabel>Potwierdź nowe hasło</InfoLabel>
            <Input
              type="password"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
              minLength={6}
            />

            <Button type="submit">Zmień hasło</Button>
          </Form>
        )}
      </PasswordChangeSection>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      {success && <SuccessMessage>{success}</SuccessMessage>}
    </Container>
  );
};

export default Profile; 