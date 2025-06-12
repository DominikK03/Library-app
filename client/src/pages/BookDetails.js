import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const theme = useTheme();

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/books/${id}`);
      setBook(response.data);
    } catch (error) {
      setError('Nie udało się pobrać informacji o książce');
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async () => {
    try {
      await axios.post(`http://localhost:5001/api/books/${id}/reserve`);
      setModalMessage('Książka została zarezerwowana! Masz 24 godziny na odbiór w bibliotece.');
      setShowModal(true);
      fetchBook();
    } catch (error) {
      setError('Nie udało się zarezerwować książki');
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'Available':
        return 'Dostępna';
      case 'Borrowed':
        return 'Wypożyczona';
      case 'Reserved':
        return 'Zarezerwowana';
      default:
        return status;
    }
  };

  if (loading) return <div>Ładowanie...</div>;
  if (error) return <div>{error}</div>;

  return (
    <Container maxWidth="md" sx={{ py: 4, mt: '80px' }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, bgcolor: 'background.paper', borderRadius: 3 }}>
        <Typography variant="h4" color="primary" fontWeight="bold" gutterBottom>
          {book?.name}
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {book?.author}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, mb: 2, bgcolor: 'background.default', borderRadius: 2, p: 2, boxShadow: 1 }}>
          <Typography variant="body1" color="text.secondary">
            <b>Gatunek:</b> {book?.genre}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <b>Rok wydania:</b> {book?.productionYear}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <b>Status:</b>{' '}
            <span style={{ color: book?.status === 'Available' ? theme.palette.success.main : book?.status === 'Reserved' ? theme.palette.warning.main : theme.palette.error.main, fontWeight: 600 }}>
              {book?.status === 'Available' ? 'Dostępna' : book?.status === 'Reserved' ? 'Zarezerwowana' : 'Wypożyczona'}
            </span>
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ mb: 3, color: 'text.primary' }}>
          <b>Opis:</b> {book?.description}
        </Typography>
        {user && (
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            {book.status === 'Available' && (
              <Button variant="outlined" color="primary" onClick={handleReserve}>Zarezerwuj</Button>
            )}
          </Box>
        )}
        {showModal && (
          <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, bgcolor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1300 }}>
            <Paper sx={{ p: 4, borderRadius: 2, maxWidth: 400, textAlign: 'center' }}>
              <Typography variant="h6" sx={{ mb: 2 }}>{modalMessage}</Typography>
              <Button variant="contained" color="primary" onClick={() => setShowModal(false)}>OK</Button>
            </Paper>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default BookDetails;
