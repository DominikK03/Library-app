import React, { useState, useEffect } from 'react';
import { fetchProfile, updateProfile, changePassword, deleteAccount } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { validatePhoneNumber, validateBirthDate, validateNameOrSurname } from '../validators/userValidator';


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
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const data = await fetchProfile();
      setProfile(data);
      setFormData({
        name: data.name,
        surname: data.surname,
        phoneNumber: data.phoneNumber || '',
        birthDate: data.birthDate || '',
      });
    } catch (err) {
      setError('Błąd pobierania profilu');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    setSuccess('');
    if (profile) {
      setFormData({
        name: profile.name,
        surname: profile.surname,
        phoneNumber: profile.phoneNumber,
        birthDate: profile.birthDate,
      });
    }
  };

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    // Walidacja imienia
    if (!validateNameOrSurname(formData.name)) {
      setError('Imię musi zaczynać się wielką literą i zawierać tylko litery.');
      return;
    }
    // Walidacja nazwiska
    if (!validateNameOrSurname(formData.surname)) {
      setError('Nazwisko musi zaczynać się wielką literą i zawierać tylko litery.');
      return;
    }
    // Walidacja numeru telefonu
    if (!validatePhoneNumber(formData.phoneNumber)) {
      setError('Numer telefonu musi składać się z dokładnie 9 cyfr');
      return;
    }
    if(!validateNameOrSurname(formData.name)) {
      setError('Imię musi zaczynać się wielką literą i zawierać tylko litery.');
      return;
    }
    if(!validateNameOrSurname(formData.surname)) {
      setError('Nazwisko musi zaczynać się wielką literą i zawierać tylko litery.');
      return;
    }
    // Walidacja daty urodzenia
    if (!validateBirthDate(formData.birthDate)) {
      setError('Data urodzenia musi być w zakresie 1925-2025 i w formacie RRRR-MM-DD');
      return;
    }
    try {
      const updated = await updateProfile(formData);
      setProfile(updated);
      setSuccess('Profil zaktualizowany!');
      setIsEditing(false);
    } catch (err) {
      setError('Błąd aktualizacji profilu');
    }
  };

  const handlePasswordChange = e => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Nowe hasła nie są zgodne');
      return;
    }
    try {
      await changePassword(passwordData);
      setSuccess('Hasło zmienione!');
      setIsPasswordFormOpen(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError('Błąd zmiany hasła');
    }
  };

  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
    setDeletePassword('');
    setDeleteError('');
  };
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setDeletePassword('');
    setDeleteError('');
  };

  const handleDeleteAccount = async () => {
    setDeleteError('');
    try {
      await deleteAccount(deletePassword);
      window.location.href = '/login';
    } catch (err) {
      setDeleteError('Błędne hasło lub błąd serwera');
    }
  };

  if (loading) return <Typography align="center">Ładowanie...</Typography>;

  return (
    <Container maxWidth="sm" sx={{ py: 4, mt: '80px' }}>
      <Typography variant="h3" color="primary" gutterBottom align="center" fontWeight="bold">
        Profil użytkownika
      </Typography>
      <Collapse in={!!success}><Alert severity="success" sx={{ mb: 2 }}>{success}</Alert></Collapse>
      <Collapse in={!!error && isEditing}><Alert severity="error" sx={{ mb: 2 }}>{error}</Alert></Collapse>
      <Collapse in={!!error && !isEditing && !isPasswordFormOpen}><Alert severity="error" sx={{ mb: 2 }}>{error}</Alert></Collapse>
      <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Dane osobowe</Typography>
        {!isEditing ? (
          <>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 2fr' },
              gap: 2,
              alignItems: 'center',
              mb: 2,
              bgcolor: 'background.default',
              borderRadius: 2,
              p: 2,
              boxShadow: 1,
              minHeight: 320,
              position: 'relative'
            }}>
              <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>Imię:</Typography>
              <Typography sx={{ fontWeight: 500 }}>{profile?.name}</Typography>
              <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>Nazwisko:</Typography>
              <Typography sx={{ fontWeight: 500 }}>{profile?.surname}</Typography>
              <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>Telefon:</Typography>
              <Typography sx={{ fontWeight: 500 }}>{profile?.phoneNumber}</Typography>
              <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>Data urodzenia:</Typography>
              <Typography sx={{ fontWeight: 500 }}>{profile?.birthDate && new Date(profile.birthDate).toLocaleDateString()}</Typography>
              <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>Email:</Typography>
              <Typography sx={{ fontWeight: 500 }}>{profile?.email}</Typography>
              <Typography sx={{ color: 'text.secondary', fontWeight: 500 }}>Membership ID:</Typography>
              <Box sx={{ fontFamily: 'monospace', fontSize: '1.1rem', bgcolor: 'background.paper', p: 1, borderRadius: 1, display: 'inline-block', fontWeight: 600, letterSpacing: 2 }}>
                {profile?.membershipId || 'Brak'}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 2, gap: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleEdit}
                sx={{ borderRadius: 2, fontWeight: 600, px: 3, boxShadow: 2, textTransform: 'none', letterSpacing: 1 }}
                size="large"
                disableElevation
              >
                Edytuj profil
              </Button>
            </Box>
          </>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              label="Imię"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Nazwisko"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Telefon"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Data urodzenia"
              name="birthDate"
              type="date"
              value={formData.birthDate ? formData.birthDate.substring(0, 10) : ''}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button variant="contained" color="primary" type="submit">Zapisz</Button>
              <Button variant="outlined" color="secondary" onClick={handleCancel}>Anuluj</Button>
            </Box>
          </Box>
        )}
      </Box>
      <Divider sx={{ my: 4 }} />
      <Box sx={{ p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 2 }}>
        <Typography variant="h6" gutterBottom>Hasło</Typography>
        <Button
          variant={isPasswordFormOpen ? 'outlined' : 'contained'}
          color={isPasswordFormOpen ? 'secondary' : 'primary'}
          onClick={() => setIsPasswordFormOpen((v) => !v)}
          sx={{ mb: 2, mr: 2 }}
        >
          {isPasswordFormOpen ? 'Anuluj zmianę hasła' : 'Zmień hasło'}
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={handleOpenDeleteDialog}
          sx={{ mb: 2, borderRadius: 2, fontWeight: 600, px: 3, textTransform: 'none', letterSpacing: 1 }}
          size="large"
        >
          Usuń konto
        </Button>
        <Collapse in={!!error && isPasswordFormOpen && !isEditing}>
          <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        </Collapse>
        <Collapse in={isPasswordFormOpen}>
          <Box component="form" onSubmit={handlePasswordSubmit} sx={{ mt: 2 }}>
            <TextField
              label="Aktualne hasło"
              name="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Nowe hasło"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Potwierdź nowe hasło"
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Button variant="contained" color="primary" type="submit">Zmień hasło</Button>
          </Box>
        </Collapse>
        <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
          <DialogTitle>Potwierdź usunięcie konta</DialogTitle>
          <DialogContent>
            <Typography sx={{ mb: 2 }}>Aby usunąć konto, podaj swoje hasło:</Typography>
            <TextField
              label="Hasło"
              type="password"
              fullWidth
              value={deletePassword}
              onChange={e => setDeletePassword(e.target.value)}
              sx={{ mb: 2 }}
            />
            {deleteError && <Alert severity="error">{deleteError}</Alert>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary">Anuluj</Button>
            <Button onClick={handleDeleteAccount} color="error" variant="contained">Usuń konto</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Profile;
