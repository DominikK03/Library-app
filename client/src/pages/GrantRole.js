import React, { useState } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';

const GrantRole = () => {
  const [membershipId, setMembershipId] = useState('');
  const [role, setRole] = useState('User');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!membershipId.trim()) {
      setError('Podaj membershipID.');
      return;
    }
    setLoading(true);
    try {
      // Wyślij membershipID i rolę bezpośrednio do backendu
      await axios.put('/api/users/change-role', {
        membershipId: membershipId.trim().toUpperCase(),
        role
      });
      setSuccess('Rola została zmieniona!');
    } catch (err) {
      setError(
        err.response?.data?.message || 'Błąd podczas zmiany roli użytkownika.'
      );
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Nadaj uprawnienia
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
        <TextField
          label="membershipID"
          value={membershipId}
          onChange={e => setMembershipId(e.target.value)}
          fullWidth
          required
          sx={{ mb: 3 }}
        />
        <TextField
          select
          label="Rola"
          value={role}
          onChange={e => setRole(e.target.value)}
          fullWidth
          required
          sx={{ mb: 3 }}
        >
          <MenuItem value="User">User</MenuItem>
          <MenuItem value="Librarian">Librarian</MenuItem>
        </TextField>
        <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
          Nadaj uprawnienia
        </Button>
        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
        {success && <Typography color="success.main" sx={{ mt: 2 }}>{success}</Typography>}
      </Box>
    </Container>
  );
};

export default GrantRole;
