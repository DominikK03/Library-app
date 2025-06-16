import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, TextField, Typography, Divider, Grid } from '@mui/material';

// Rozszerzona lista gatunków podzielona na kategorie
const genreCategories = {
  "Gatunki podstawowe": ['Kryminał', 'Fantasy', 'Sci-Fi', 'Horror', 'Romans', 'Biografia', 'Historyczna', 'Przygodowa'],

  "Literatura piękna i klasyczna": ['Literatura piękna', 'Klasyka', 'Poezja', 'Dramat', 'Powieść historyczna', 'Literatura modernistyczna',
    'Literatura postmodernistyczna', 'Esej', 'Satyra', 'Literatura faktu'],

  "Gatunki popularne": ['Thriller', 'Powieść detektywistyczna', 'Sensacja', 'Romans historyczny', 'Romans paranormalny',
    'Urban fantasy', 'Space opera', 'Dystopia', 'Utopia', 'Cyberpunk', 'Steampunk', 'Postapokaliptyczna',
    'Komedia', 'Tragedia', 'Melodramat'],

  "Literatura dla młodzieży i dzieci": ['Young Adult', 'Middle Grade', 'Literatura dziecięca', 'Baśń', 'Bajka', 'Powieść inicjacyjna',
    'Powieść młodzieżowa'],

  "Literatura specjalistyczna": ['Reportaż', 'Wspomnienia', 'Autobiografia', 'Pamiętniki', 'Literatura podróżnicza',
    'Literatura religijna', 'Literatura filozoficzna', 'Literatura naukowa', 'Popularnonaukowa',
    'Poradnik', 'Podręcznik'],

  "Gatunki niszowe": ['Weird fiction', 'Bizarro fiction', 'Fantastyka slipstream', 'Military sci-fi', 'Hard sci-fi',
    'Soft sci-fi', 'High fantasy', 'Low fantasy', 'Dark fantasy', 'Realizm magiczny'],

  "Gatunki narodowe": ['Literatura polska', 'Literatura amerykańska', 'Literatura rosyjska', 'Literatura francuska',
    'Literatura brytyjska', 'Literatura japońska', 'Literatura latynoamerykańska'],

  "Gatunki mieszane": ['Powieść graficzna', 'Komiks', 'Manga', 'Interaktywna fikcja', 'Fanfiction']
};

// Płaska lista wszystkich gatunków do użycia w innych miejscach jeśli potrzebna
const allGenres = Object.values(genreCategories).flat();

const AddBook = () => {
  const [formData, setFormData] = useState({
    name: '',
    author: '',
    genre: [],
    productionYear: '',
    description: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGenreChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => {
      const updatedGenres = checked
        ? [...prev.genre, value]
        : prev.genre.filter((genre) => genre !== value);
      return { ...prev, genre: updatedGenres };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/books', formData);
      navigate('/');
    } catch (err) {
      setError('Nie udało się dodać książki. Sprawdź dane i spróbuj ponownie.');
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Dodaj książkę</Typography>
      {error && <Typography color="error" gutterBottom>{error}</Typography>}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Tytuł"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Autor"
          name="author"
          value={formData.author}
          onChange={handleInputChange}
          margin="normal"
          required
        />

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>Gatunki</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Wybierz jeden lub więcej gatunków dla książki
        </Typography>

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
                          checked={formData.genre.includes(genre)}
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

        <TextField
          fullWidth
          label="Rok wydania"
          name="productionYear"
          value={formData.productionYear}
          onChange={handleInputChange}
          margin="normal"
          required
          type="number"
        />
        <TextField
          fullWidth
          label="Opis"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          margin="normal"
          multiline
          rows={4}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          disabled={formData.genre.length === 0}
        >
          Dodaj książkę
        </Button>
      </form>
    </Box>
  );
};

export default AddBook;
