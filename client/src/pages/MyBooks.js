import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchMyBooks as fetchMyBooksService, extendBorrow } from '../services/bookService';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';

const MyBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [reservedBooks, setReservedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [extendDialogOpen, setExtendDialogOpen] = useState(false);
  const [extendBookId, setExtendBookId] = useState(null);
  const [extendDays, setExtendDays] = useState(1);
  const [extendCost, setExtendCost] = useState(1);
  const [extendLoading, setExtendLoading] = useState(false);
  const [extendError, setExtendError] = useState('');
  const [extendSuccess, setExtendSuccess] = useState('');

  useEffect(() => {
    fetchBooks();
    // Dodaj nasłuchiwanie na widoczność strony (odśwież dane po powrocie na zakładkę)
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        fetchBooks();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await fetchMyBooksService();
      setBorrowedBooks(data.borrowedBooks);
      setReservedBooks(data.reservedBooks);
    } catch (error) {
      setError('Nie udało się pobrać listy książek');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenExtendDialog = (bookId) => {
    setExtendBookId(bookId);
    setExtendDays(1);
    setExtendCost(1);
    setExtendDialogOpen(true);
    setExtendError('');
    setExtendSuccess('');
  };

  const handleCloseExtendDialog = () => {
    setExtendDialogOpen(false);
    setExtendBookId(null);
    setExtendDays(1);
    setExtendCost(1);
    setExtendError('');
    setExtendSuccess('');
  };

  const handleExtendDaysChange = (e) => {
    const value = Math.max(1, parseInt(e.target.value) || 1);
    setExtendDays(value);
    setExtendCost(value);
  };

  const handleExtendSubmit = async () => {
    setExtendLoading(true);
    setExtendError('');
    setExtendSuccess('');
    try {
      await extendBorrow(extendBookId, extendDays);
      setExtendSuccess('Przedłużono wypożyczenie!');
      fetchBooks();
      setExtendDialogOpen(false);
    } catch (error) {
      setExtendError('Błąd przedłużania wypożyczenia');
    } finally {
      setExtendLoading(false);
    }
  };

  // Funkcja pomocnicza do obliczania pozostałego czasu rezerwacji
  const getReservationTimeLeft = (expires) => {
    if (!expires) return null;
    const now = new Date();
    const end = new Date(expires);
    const diffMs = end - now;
    if (diffMs <= 0) return 'Rezerwacja wygasła';
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `pozostało ${hours}h ${minutes}min`;
  };

  if (loading) return <Typography align="center">Ładowanie...</Typography>;
  if (error) return <Typography color="error" align="center">{error}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: '80px' }}>
      <Typography variant="h3" color="primary" gutterBottom align="center" fontWeight="bold">
        Moje książki
      </Typography>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h5" color="primary" gutterBottom>
          Wypożyczone książki
        </Typography>
        <Grid container spacing={3}>
          {borrowedBooks.map((book) => {
            const daysLeft = book.dueDate ? Math.ceil((new Date(book.dueDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={book._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 3, boxShadow: 4, bgcolor: 'background.paper' }}>
                  <CardActionArea component={Link} to={`/books/${book._id}`} sx={{ flexGrow: 1 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>{book.name || book.title}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{book.author}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {book.productionYear && `Rok wydania: ${book.productionYear}`}
                      </Typography>
                      <Chip label="Wypożyczona" color="error" size="small" sx={{ mb: 1, fontWeight: 600 }} />
                      {book.dueDate && (
                        <Typography variant="body2" color="text.secondary">
                          Data zwrotu: <b>{new Date(book.dueDate).toLocaleDateString()}</b>
                          {daysLeft !== null && daysLeft >= 0 && (
                            <> &nbsp; (pozostało <b>{daysLeft}</b> dni)</>
                          )}
                        </Typography>
                      )}
                    </CardContent>
                  </CardActionArea>
                  <Box sx={{ p: 2, pt: 0 }}>
                    <Button variant="contained" color="primary" fullWidth onClick={() => handleOpenExtendDialog(book._id)}>
                      Przedłuż wypożyczenie
                    </Button>
                  </Box>
                </Card>
              </Grid>
            );
          })}
          {borrowedBooks.length === 0 && (
            <Grid item xs={12}><Typography align="center" color="text.secondary">Nie masz obecnie wypożyczonych książek.</Typography></Grid>
          )}
        </Grid>
      </Box>
      <Box>
        <Typography variant="h5" color="primary" gutterBottom>
          Zarezerwowane książki
        </Typography>
        <Grid container spacing={3}>
          {reservedBooks.map((book) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={book._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRadius: 3, boxShadow: 4, bgcolor: 'background.paper' }}>
                <CardActionArea component={Link} to={`/books/${book._id}`} sx={{ flexGrow: 1 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'primary.main' }}>{book.name || book.title}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{book.author}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {book.productionYear && `Rok wydania: ${book.productionYear}`}
                    </Typography>
                    <Chip label="Zarezerwowana" color="warning" size="small" sx={{ mb: 1, fontWeight: 600 }} />
                    {book.reservationExpires && (
                      <Typography variant="body2" color="text.secondary">
                        Rezerwacja ważna do: <b>{new Date(book.reservationExpires).toLocaleDateString()}</b>
                        &nbsp;({getReservationTimeLeft(book.reservationExpires)})
                      </Typography>
                    )}
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
          {reservedBooks.length === 0 && (
            <Grid item xs={12}><Typography align="center" color="text.secondary">Nie masz obecnie zarezerwowanych książek.</Typography></Grid>
          )}
        </Grid>
      </Box>
      <Dialog open={extendDialogOpen} onClose={handleCloseExtendDialog}>
        <DialogTitle>Przedłuż wypożyczenie</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Liczba dni"
            type="number"
            value={extendDays}
            onChange={handleExtendDaysChange}
            fullWidth
            inputProps={{ min: 1 }}
          />
          <Typography sx={{ mt: 2 }}>Koszt: <b>{extendCost} zł</b></Typography>
          {extendError && <Typography color="error">{extendError}</Typography>}
          {extendSuccess && <Typography color="primary">{extendSuccess}</Typography>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseExtendDialog}>Anuluj</Button>
          <Button onClick={handleExtendSubmit} disabled={extendLoading} variant="contained">Przedłuż</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyBooks;
