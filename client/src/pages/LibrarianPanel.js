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
import Modal from '@mui/material/Modal';
import { FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import Divider from '@mui/material/Divider';

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
  const [form, setForm] = useState({ name: '', author: '', genre: [''], productionYear: '', description: '' });
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

  // --- Wypożyczone książki użytkownika ---
  const [borrowedBooks, setBorrowedBooks] = useState([]);
  const [borrowedLoading, setBorrowedLoading] = useState(false);
  const [borrowedError, setBorrowedError] = useState('');
  const [returnSuccess, setReturnSuccess] = useState('');

  // --- Stany do przedłużania wypożyczenia ---
  const [extendModalOpen, setExtendModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [extendDays, setExtendDays] = useState(0);
  const [predictedReturnDate, setPredictedReturnDate] = useState(null);
  const [extendError, setExtendError] = useState('');

  const [formError, setFormError] = useState(null); // Zmieniono nazwę zmiennej z 'error' na 'formError'
  const [formData, setFormData] = useState({
    name: '',
    author: '',
    genre: '',
    productionYear: '',
    description: ''
  });

  // Zmieniono listę gatunków na pogrupowaną, rozszerzoną wersję
  const genreCategories = {
    "Gatunki podstawowe": ['Kryminał', 'Fantasy', 'Sci-Fi', 'Horror', 'Romans', 'Biografia', 'Historyczna', 'Przygodowa'],

    "Literatura piękna i klasyczna": ['Literatura piękna', 'Klasyka', 'Poezja', 'Dramat', 'Powieść historyczna', 'Literatura modernistyczna',
      'Literatura postmodernistyczna', 'Esej', 'Satyra', 'Literatura faktu'],

    "Gatunki popularne": ['Thriller', 'Powieść detektywistyczna', 'Sensacja', 'Romans historyczny', 'Romans paranormalny',
      'Urban fantasy', 'Space opera', 'Dystopia', 'Utopia', 'Cyberpunk', 'Steampunk', 'Postapokaliptyczna',
      'Komedia', 'Tragedia', 'Melodramat', 'Powieść psychologiczna', 'Powieść gotycka'],

    "Literatura dla młodzieży i dzieci": ['Young Adult', 'Middle Grade', 'Literatura dziecięca', 'Baśń', 'Bajka', 'Powieść inicjacyjna',
      'Powieść młodzieżowa'],

    "Literatura specjalistyczna": ['Reportaż', 'Wspomnienia', 'Autobiografia', 'Pamiętniki', 'Literatura podróżnicza',
      'Literatura religijna', 'Literatura filozoficzna', 'Literatura naukowa', 'Popularnonaukowa',
      'Poradnik', 'Podręcznik'],

    "Gatunki niszowe": ['Weird fiction', 'Bizarro fiction', 'Fantastyka slipstream', 'Military sci-fi', 'Hard sci-fi',
      'Soft sci-fi', 'High fantasy', 'Low fantasy', 'Dark fantasy', 'Realizm magiczny'],

    "Gatunki narodowe": ['Literatura polska', 'Literatura amerykańska', 'Literatura rosyjska', 'Literatura francuska',
      'Literatura brytyjska', 'Literatura japońska', 'Literatura latynoamerykańska', 'Literatura hiszpańska'],

    "Gatunki mieszane": ['Powieść graficzna', 'Komiks', 'Manga', 'Interaktywna fikcja', 'Fanfiction']
  };

  // Płaska lista wszystkich gatunków do użycia w innych miejscach
  const allGenres = Object.values(genreCategories).flat();

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
    setForm(book ? { ...book } : { name: '', author: '', genre: [''], productionYear: '', description: '' });
    setDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditBook(null);
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };
  const handleGenreChange = (e) => {
    const { value, checked } = e.target;
    setForm((prev) => {
      const updatedGenres = checked
        ? [...prev.genre, value] // Dodaj gatunek, jeśli zaznaczony
        : prev.genre.filter((genre) => genre !== value); // Usuń gatunek, jeśli odznaczony
      return { ...prev, genre: updatedGenres };
    });
  };
  const addGenreField = () => {
    setForm({ ...form, genre: [...form.genre, ''] });
  };
  const removeGenreField = (index) => {
    const updatedGenres = form.genre.filter((_, i) => i !== index);
    setForm({ ...form, genre: updatedGenres });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    try {
      if (editBook) {
        await axios.put(`/api/books/${editBook._id}`, form);
      } else {
        await axios.post('/api/books', {
          ...form,
          productionYear: parseInt(form.productionYear, 10)
        });
      }
      fetchBooks();
      handleCloseDialog();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setFormError(err.response.data.message);
      } else {
        setFormError('Wystąpił nieoczekiwany błąd.');
      }
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
    setBorrowedBooks([]);
    setReturnSuccess('');
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
      // pobierz wypożyczone książki
      fetchBorrowedBooks(res.data.user.membershipId);
    } catch (e) {
      if (e.response && e.response.data && e.response.data.message) {
        setUserSearchError(e.response.data.message);
      } else if (e.response && e.response.status === 500) {
        setUserSearchError('Błąd serwera. Sprawdź logi backendu.');
      } else {
        setUserSearchError('Błąd wyszukiwania użytkownika');
      }
      setFoundUser(null);
      setBorrowedBooks([]);
      console.error('Błąd zapytania do /api/books/reserved-by-membership:', e);
    }
    setUserSearchLoading(false);
  };

  // Pobierz wypożyczone książki po membershipId
  const fetchBorrowedBooks = async (membershipId) => {
    setBorrowedLoading(true);
    setBorrowedError('');
    setBorrowedBooks([]);
    try {
      const res = await axios.get(`/api/users/borrowed-books-by-membership/${membershipId}`);
      setBorrowedBooks(res.data.borrowedBooks);
    } catch (e) {
      setBorrowedError('Błąd pobierania wypożyczonych książek');
    }
    setBorrowedLoading(false);
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

  // Przedłuż wypożyczenie (wywołuje istniejący endpoint)
  const handleLibrarianExtend = async (bookId) => {
    try {
      await axios.post(`/api/users/extend-borrowing/${bookId}`, { days: 30 });
      setReturnSuccess('Wypożyczenie przedłużone o 30 dni.');
      if (foundUser) fetchBorrowedBooks(foundUser.membershipId);
    } catch (e) {
      setReturnSuccess('Błąd przedłużania wypożyczenia.');
    }
  };

  // Zwróć książkę (resetuje status i powiązania)
  const handleLibrarianReturn = async (bookId) => {
    try {
      await axios.post(`/api/users/return-book/${bookId}`);
      setReturnSuccess('Książka została zwrócona.');
      if (foundUser) fetchBorrowedBooks(foundUser.membershipId);
    } catch (e) {
      setReturnSuccess('Błąd zwrotu książki.');
    }
  };

  // Obsługa przedłużania wypożyczenia
  const handleExtendDaysChange = (e) => {
    const days = parseInt(e.target.value, 10);
    if (isNaN(days) || days < 0) {
      setExtendError('Podaj poprawną liczbę dni.');
      setExtendDays(0);
      setPredictedReturnDate(null);
      return;
    }
    if (days > 30) {
      setExtendError('Nie można przedłużyć o więcej niż 30 dni.');
      setExtendDays(30);
      return;
    }
    setExtendError('');
    setExtendDays(days);

    if (selectedBook) {
      const borrowTime = new Date(selectedBook.borrowTime);
      const defaultReturnDate = new Date(borrowTime);
      defaultReturnDate.setDate(borrowTime.getDate() + 30); // Domyślny okres wypożyczenia
      const newReturnDate = new Date(defaultReturnDate);
      newReturnDate.setDate(defaultReturnDate.getDate() + days);
      setPredictedReturnDate(newReturnDate.toLocaleDateString());
    }
  };

  const handleExtendSubmit = async (bookId) => {
    try {
      await axios.post(`/api/users/extend-borrowing/${bookId}`, { days: extendDays });
      setReturnSuccess('Wypożyczenie przedłużone.');
      fetchBorrowedBooks(foundUser.membershipId);
    } catch (e) {
      setReturnSuccess('Błąd przedłużania wypożyczenia.');
    }
  };

  const handleOpenExtendModal = (book) => {
    setSelectedBook(book);
    setExtendModalOpen(true);
    setExtendDays(0);
    setPredictedReturnDate(null);
    setExtendError('');
  };

  const handleCloseExtendModal = () => {
    setExtendModalOpen(false);
    setSelectedBook(null);
  };

  const handleAddBook = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/books', form);
      setForm({ name: '', author: '', genre: [], productionYear: '', description: '' });
      alert('Książka została dodana!');
    } catch (err) {
      alert('Nie udało się dodać książki. Sprawdź dane i spróbuj ponownie.');
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
        {formError && <Typography color="error" sx={{ mb: 2 }}>{formError}</Typography>}
        <Stack component="form" direction="column" spacing={2} onSubmit={handleSubmit}>
          <TextField label="Tytuł" name="name" value={form.name} onChange={handleInputChange} required fullWidth />
          <TextField label="Autor" name="author" value={form.author} onChange={handleInputChange} required fullWidth />
          <Typography variant="subtitle1" gutterBottom>Gatunki</Typography>
          <Box sx={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #e0e0e0', borderRadius: '4px', p: 2 }}>
            {Object.entries(genreCategories).map(([category, genres]) => (
              <Box key={category} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                  {category}
                </Typography>
                <Grid container spacing={1}>
                  {genres.map((genre) => (
                    <Grid item xs={6} sm={4} key={genre}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            value={genre}
                            checked={form.genre.includes(genre)}
                            onChange={handleGenreChange}
                            size="small"
                          />
                        }
                        label={genre}
                      />
                    </Grid>
                  ))}
                </Grid>
                <Divider sx={{ mt: 1 }} />
              </Box>
            ))}
          </Box>

          <TextField label="Rok wydania" name="productionYear" value={form.productionYear} onChange={handleInputChange} required fullWidth />
          <TextField label="Opis" name="description" value={form.description} onChange={handleInputChange} multiline minRows={2} fullWidth />
          <Button type="submit" variant="contained" color="primary">{editBook ? 'Zapisz zmiany' : 'Dodaj książkę'}</Button>
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
          Wydawanie/Zwroty książek
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
      {/* Sekcja wypożyczonych książek użytkownika */}
      {foundUser && (
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3, boxShadow: 3 }}>
          <Typography variant="h5" color="primary" gutterBottom fontWeight="bold">
            Wypożyczone książki
          </Typography>
          {borrowedLoading && <Typography color="text.secondary">Ładowanie wypożyczonych książek...</Typography>}
          {borrowedError && <Typography color="error">{borrowedError}</Typography>}
          {borrowedBooks.length === 0 && <Typography color="text.secondary">Brak wypożyczonych książek.</Typography>}
          <Grid container spacing={2}>
            {borrowedBooks.map(book => (
              <Grid item xs={12} sm={6} md={4} key={book._id}>
                <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
                  <CardContent>
                    <Typography variant="h6">{book.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{book.author}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Data wypożyczenia: {book.borrowTime ? new Date(book.borrowTime).toLocaleDateString() : 'Brak danych'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Termin zwrotu: {book.dueDate ? new Date(book.dueDate).toLocaleDateString() : (book.borrowTime ? new Date(new Date(book.borrowTime).getTime() + 30*24*60*60*1000).toLocaleDateString() : 'Brak danych')}
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Button variant="contained" color="primary" size="small" onClick={() => handleOpenExtendModal(book)}>
                        Przedłuż wypożyczenie
                      </Button>
                      <Button variant="contained" color="secondary" size="small" onClick={() => handleLibrarianReturn(book._id)}>
                        Zwróć książkę
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          {returnSuccess && <Typography color="success.main" sx={{ mt: 2 }}>{returnSuccess}</Typography>}

          {/* Modal for extending borrow */}
          <Modal open={extendModalOpen} onClose={handleCloseExtendModal}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 24 }}>
              <Typography variant="h6" gutterBottom>Przedłuż wypożyczenie</Typography>
              {selectedBook && (
                <>
                  <Typography variant="body2" gutterBottom>Książka: {selectedBook.name}</Typography>
                  <Typography variant="body2" gutterBottom>Autor: {selectedBook.author}</Typography>
                  <TextField
                    label="Przedłuż o dni"
                    type="number"
                    value={extendDays}
                    onChange={handleExtendDaysChange}
                    fullWidth
                    margin="normal"
                  />
                  {predictedReturnDate && (
                    <Typography variant="body2" color="text.secondary">
                      Przewidywany termin zwrotu: {predictedReturnDate}
                    </Typography>
                  )}
                  {extendError && (
                    <Typography color="error" variant="body2">{extendError}</Typography>
                  )}
                  <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="contained" color="primary" onClick={handleExtendSubmit} disabled={extendDays === 0 || !!extendError}>
                      Zatwierdź
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleCloseExtendModal}>
                      Anuluj
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          </Modal>
        </Paper>
      )}
    </Container>
  );
};

export default LibrarianPanel;
