import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Autocomplete from '@mui/material/Autocomplete';
import { useAuth } from '../contexts/AuthContext';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';

// Ustaw token JWT globalnie dla axios jeśli istnieje
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const LibrarianPanel = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const [form, setForm] = useState({ name: '', author: '', genre: '', productionYear: '', description: '' });
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // --- Sekcja obsługi rezerwacji użytkownika ---
  const [userSearch, setUserSearch] = useState({ membershipId: '' });
  const [reservedBooks, setReservedBooks] = useState([]);
  const [foundUser, setFoundUser] = useState(null);
  const [userSearchError, setUserSearchError] = useState('');
  const [userSearchLoading, setUserSearchLoading] = useState(false);
  const [borrowSuccess, setBorrowSuccess] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'Librarian') {
      navigate('/');
    }
    fetchBooks();
    // eslint-disable-next-line
  }, [user]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/books');
      setBooks(res.data);
    } catch (e) {
      setError('Błąd pobierania książek');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (book = null) => {
    setEditBook(book);
    setForm(book ? { ...book } : { name: '', author: '', genre: '', productionYear: '', description: '' });
    setDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditBook(null);
  };
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async () => {
    try {
      if (editBook) {
        await axios.put(`/api/books/${editBook._id}`, form);
      } else {
        await axios.post('/api/books', form);
      }
      fetchBooks();
      handleCloseDialog();
    } catch (e) {
      setError('Błąd zapisu książki');
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Na pewno usunąć książkę?')) return;
    try {
      await axios.delete(`/api/books/${id}`);
      fetchBooks();
    } catch (e) {
      setError('Błąd usuwania książki');
    }
  };

  // Obsługa wyszukiwania z podpowiedziami
  useEffect(() => {
    if (search.length < 2) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await axios.get(`/api/books?search=${encodeURIComponent(search)}`);
        setSearchResults(res.data);
      } catch (e) {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  // --- Obsługa rezerwacji użytkownika ---
  const handleUserSearch = async () => {
    setUserSearchError('');
    setReservedBooks([]);
    setFoundUser(null);
    setUserSearchLoading(true);
    try {
      if (!userSearch.membershipId || !userSearch.membershipId.trim()) {
        setUserSearchError('Podaj membershipID');
        setUserSearchLoading(false);
        return;
      }
      const res = await axios.post('/api/books/reserved-by-membership', {
        membershipId: userSearch.membershipId.trim().toUpperCase()
      });
      setReservedBooks(res.data.books);
      setFoundUser(res.data.user);
    } catch (e) {
      if (e.response && e.response.data && e.response.data.message) {
        setUserSearchError(e.response.data.message);
      } else if (e.response && e.response.status === 500) {
        setUserSearchError('Błąd serwera. Sprawdź logi backendu.');
      } else {
        setUserSearchError('Błąd wyszukiwania użytkownika');
      }
      console.error('Błąd zapytania do /api/books/reserved-by-membership:', e);
    }
    setUserSearchLoading(false);
  };

  const handleLibrarianBorrow = async (bookId) => {
    setBorrowSuccess('');
    try {
      await axios.post(`/api/books/${bookId}/librarian-borrow`);
      setBorrowSuccess('Książka została wydana i wypożyczona.');
      handleUserSearch(); // odśwież listę zarezerwowanych książek
    } catch (e) {
      setUserSearchError(e.response?.data?.message || 'Błąd podczas wydawania książki');
    }
  };

  if (loading) return <Typography align="center">Ładowanie...</Typography>;
  if (error) return <Typography color="error" align="center">{error}</Typography>;

  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: '80px' }}>
      <Typography variant="h4" color="primary" sx={{ mb: 3, textAlign: 'center' }}>Panel bibliotekarza</Typography>
      {/* Formularz dodawania/edycji */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>{editBook ? 'Edytuj książkę' : 'Dodaj książkę'}</Typography>
        <Stack component="form" direction={{ xs: 'column', sm: 'row' }} spacing={4} flexWrap="wrap" alignItems="flex-end" onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
          <TextField label="Tytuł" name="name" value={form.name} onChange={handleChange} required sx={{ minWidth: 200, flex: 1 }} />
          <TextField label="Autor" name="author" value={form.author} onChange={handleChange} required sx={{ minWidth: 170, flex: 1 }} />
          <TextField label="Gatunek" name="genre" value={form.genre} onChange={handleChange} required sx={{ minWidth: 140, flex: 1 }} />
          <TextField label="Rok wydania" name="productionYear" value={form.productionYear} onChange={handleChange} required sx={{ minWidth: 120, flex: 1 }} />
          <TextField label="Opis" name="description" value={form.description} onChange={handleChange} multiline minRows={2} sx={{ minWidth: 220, flex: 2, mt: 2 }} />
          <Button type="submit" variant="contained" color="primary" sx={{ height: 56 }}>{editBook ? 'Zapisz zmiany' : 'Dodaj książkę'}</Button>
          {editBook && <Button onClick={() => { setEditBook(null); setForm({ name: '', author: '', genre: '', productionYear: '', description: '' }); }} color="secondary" sx={{ height: 56 }}>Anuluj</Button>}
        </Stack>
      </Paper>
      {/* Wyszukiwarka z podpowiedziami */}
      <Autocomplete
        freeSolo
        options={searchResults.map(b => b.name)}
        loading={searchLoading}
        inputValue={search}
        onInputChange={(_, value) => setSearch(value)}
        renderInput={(params) => (
          <TextField {...params} label="Wyszukaj książkę" variant="outlined" sx={{ mb: 3 }} />
        )}
      />
      {/* Lista wyników wyszukiwania */}
      <Grid container spacing={3}>
        {search.length >= 2 && searchResults.map(book => (
          <Grid item xs={12} md={6} lg={6} key={book._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{book.name}</Typography>
                <Typography variant="body2" color="text.secondary">{book.author}</Typography>
                <Typography variant="body2" color="text.secondary">{book.genre}</Typography>
                <Typography variant="body2" color="text.secondary">{book.productionYear}</Typography>
                <Typography variant="body2" color="text.secondary">{book.description}</Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                  <IconButton color="primary" onClick={() => { setEditBook(book); setForm({ ...book }); }}><EditIcon /></IconButton>
                  <IconButton color="error" onClick={() => handleDelete(book._id)}><DeleteIcon /></IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Sekcja rezerwacji użytkownika */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h5" color="primary" gutterBottom fontWeight="bold">
          Wydawanie książek z rezerwacji
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
          <TextField label="Membership ID" value={userSearch.membershipId} onChange={e => setUserSearch({ membershipId: e.target.value })} size="small" />
          <Button variant="contained" onClick={handleUserSearch} disabled={userSearchLoading}>Szukaj</Button>
        </Box>
        {userSearchError && <Typography color="error">{userSearchError}</Typography>}
        {foundUser && (
          <Box sx={{ mb: 2 }}>
            <Typography>Użytkownik: <b>{foundUser.name} {foundUser.surname}</b> (ID: {foundUser.membershipId})</Typography>
          </Box>
        )}
        {reservedBooks.length > 0 && (
          <Grid container spacing={2}>
            {reservedBooks.map(book => (
              <Grid item xs={12} sm={6} md={4} key={book._id}>
                <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{book.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{book.author}</Typography>
                    <Typography variant="body2" color="text.secondary">Status: <b>Zarezerwowana</b></Typography>
                    <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => handleLibrarianBorrow(book._id)}>
                      Wydaj / Wypożycz
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        {foundUser && reservedBooks.length === 0 && !userSearchError && (
          <Typography color="text.secondary">Brak zarezerwowanych książek.</Typography>
        )}
        {borrowSuccess && <Typography color="success.main">{borrowSuccess}</Typography>}
      </Paper>
    </Container>
  );
};

export default LibrarianPanel;
