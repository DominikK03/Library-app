import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';

function Home() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');

  useEffect(() => {
    axios.get('/api/books')
      .then(res => setBooks(res.data))
      .catch(err => console.error(err));
  }, []);

  // Zlicz gatunki i autorów - uwzględniając, że genre jest tablicą
  const genreCounts = books.reduce((acc, book) => {
    if (book.genre && Array.isArray(book.genre)) {
      book.genre.forEach(g => {
        if (g) acc[g] = (acc[g] || 0) + 1;
      });
    }
    return acc;
  }, {});

  const authorCounts = books.reduce((acc, book) => {
    if (book.author) acc[book.author] = (acc[book.author] || 0) + 1;
    return acc;
  }, {});

  const filteredBooks = books.filter(book => {
    const matchesSearch = (book.name && book.name.toLowerCase().includes(search.toLowerCase())) ||
      (book.author && book.author.toLowerCase().includes(search.toLowerCase()));

    // Sprawdź, czy książka zawiera wybrany gatunek (jeśli jest wybrany)
    const matchesGenre = selectedGenre
      ? (Array.isArray(book.genre) && book.genre.includes(selectedGenre))
      : true;

    const matchesAuthor = selectedAuthor ? book.author === selectedAuthor : true;
    return matchesSearch && matchesGenre && matchesAuthor;
  });

  return (
    <Box sx={{ display: 'flex' }}>
      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          width: 260,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: 260,
            boxSizing: 'border-box',
            top: '64px', // zamiast pt, przesuwamy Drawer poniżej AppBar
            height: 'calc(100vh - 64px)', // zmniejszamy wysokość, by nie nachodził na navbar
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>Filtruj</Typography>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>Gatunki</Typography>
          <List>
            <ListItem disablePadding>
              <ListItemButton selected={selectedGenre === ''} onClick={() => setSelectedGenre('')}>
                <ListItemText primary="Wszystkie" />
              </ListItemButton>
            </ListItem>
            {Object.entries(genreCounts).map(([genre, count]) => (
              <ListItem disablePadding key={genre}>
                <ListItemButton selected={selectedGenre === genre} onClick={() => setSelectedGenre(genre)}>
                  <ListItemText primary={`${genre} (${count})`} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1">Autorzy</Typography>
          <List>
            <ListItem disablePadding>
              <ListItemButton selected={selectedAuthor === ''} onClick={() => setSelectedAuthor('')}>
                <ListItemText primary="Wszyscy" />
              </ListItemButton>
            </ListItem>
            {Object.entries(authorCounts).map(([author, count]) => (
              <ListItem disablePadding key={author}>
                <ListItemButton selected={selectedAuthor === author} onClick={() => setSelectedAuthor(author)}>
                  <ListItemText primary={`${author} (${count})`} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Container maxWidth="lg" sx={{ py: 4, mt: '80px', ml: '260px', pt: '0' }}>
        <Typography variant="h3" color="primary" gutterBottom align="center" fontWeight="bold">
          Książki w bibliotece
        </Typography>
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            label="Wyszukaj książkę lub autora"
            variant="outlined"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </Box>
        <Grid container spacing={4}>
          {filteredBooks.map(book => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={book._id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardActionArea component={Link} to={`/books/${book._id}`}>
                  {book.coverUrl && (
                    <CardMedia
                      component="img"
                      height="200"
                      image={book.coverUrl}
                      alt={book.title}
                    />
                  )}
                  <CardContent>
                    <Typography variant="h6" component="div" gutterBottom>
                      {book.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {book.author ? book.author : 'Brak autora'}
                      {book.productionYear ? ` (${book.productionYear})` : ''}
                    </Typography>
                    <Typography variant="body2" color={
                      book.status === 'Available' ? 'success.main' :
                      book.status === 'Reserved' ? 'warning.main' :
                      book.status === 'Borrowed' ? 'error.main' : 'text.secondary'
                    } fontWeight="bold">
                      {book.status === 'Available' && 'Dostępna'}
                      {book.status === 'Reserved' && 'Zarezerwowana'}
                      {book.status === 'Borrowed' && 'Wypożyczona'}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default Home;
