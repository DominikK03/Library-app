exports.validateBookData = (data) => {
    const { name, author, genre, productionYear } = data;

    if (!name) {
        return 'Name is required';
    }
    if (!author) {
        return 'Author is required';
    }
    if (!genre) {
        return 'Genre is required';
    }

    // Diagnostyka typu danych genre
    console.log('Genre data type:', typeof genre);
    console.log('Genre value:', JSON.stringify(genre));

    // Obsługa przypadku, gdy genre jest stringiem (np. z formularza)
    let genreArray = genre;
    if (typeof genre === 'string') {
        // Jeśli to pojedynczy string, podziel po przecinku
        genreArray = genre.split(',').map(g => g.trim()).filter(g => g !== '');
        console.log('Converted genre string to array:', genreArray);
    } else if (Array.isArray(genre)) {
        // Jeśli to już tablica, upewnij się że nie ma pustych elementów
        genreArray = genre.filter(g => g && typeof g === 'string' && g.trim() !== '');
        console.log('Filtered genre array:', genreArray);
    } else {
        console.log('Invalid genre format - not a string or array');
        return 'Genre must be an array or a comma-separated string';
    }

    // Sprawdzenie czy tablica nie jest pusta
    if (genreArray.length === 0) {
        console.log('Empty genre array after processing');
        return 'Genre must be a non-empty array';
    }

    // Walidacja każdego elementu w tablicy
    for (const g of genreArray) {
        console.log('Validating genre item:', g, 'type:', typeof g);
        if (typeof g !== 'string' || g.trim() === '') {
            return 'Each genre must be a non-empty string';
        }
    }

    // Rozszerzona lista wspieranych gatunków
    const validGenres = [
        // Gatunki podstawowe
        'Kryminał', 'Fantasy', 'Sci-Fi', 'Horror', 'Romans', 'Biografia', 'Historyczna', 'Przygodowa',

        // Literatura piękna i klasyczna
        'Literatura piękna', 'Klasyka', 'Poezja', 'Dramat', 'Powieść historyczna', 'Literatura modernistyczna',
        'Literatura postmodernistyczna', 'Esej', 'Satyra', 'Literatura faktu',

        // Gatunki popularne
        'Thriller', 'Powieść detektywistyczna', 'Sensacja', 'Romans historyczny', 'Romans paranormalny',
        'Urban fantasy', 'Space opera', 'Dystopia', 'Utopia', 'Cyberpunk', 'Steampunk', 'Postapokaliptyczna',
        'Komedia', 'Tragedia', 'Melodramat',

        // Literatura dla młodzieży i dzieci
        'Young Adult', 'Middle Grade', 'Literatura dziecięca', 'Baśń', 'Bajka', 'Powieść inicjacyjna',
        'Powieść młodzieżowa',

        // Literatura specjalistyczna
        'Reportaż', 'Wspomnienia', 'Autobiografia', 'Pamiętniki', 'Literatura podróżnicza',
        'Literatura religijna', 'Literatura filozoficzna', 'Literatura naukowa', 'Popularnonaukowa',
        'Poradnik', 'Podręcznik',

        // Gatunki niszowe
        'Weird fiction', 'Bizarro fiction', 'Fantastyka slipstream', 'Military sci-fi', 'Hard sci-fi',
        'Soft sci-fi', 'High fantasy', 'Low fantasy', 'Dark fantasy', 'Realizm magiczny',

        // Gatunki narodowe
        'Literatura polska', 'Literatura amerykańska', 'Literatura rosyjska', 'Literatura francuska',
        'Literatura brytyjska', 'Literatura japońska', 'Literatura latynoamerykańska',

        // Gatunki mieszane
        'Powieść graficzna', 'Komiks', 'Manga', 'Interaktywna fikcja', 'Fanfiction'
    ];

    // Sprawdzamy, czy wszystkie podane gatunki są wspierane
    for (const g of genreArray) {
        if (!validGenres.includes(g)) {
            return `Genre "${g}" is not supported. Supported genres: ${validGenres.join(', ')}`;
        }
    }

    if (!productionYear) {
        return 'Production year is required';
    }

    // Konwersja roku produkcji na liczbę
    const yearValue = Number(productionYear);
    if (isNaN(yearValue) || yearValue < 1000 || yearValue > new Date().getFullYear()) {
        return 'Production year must be a number between 1000 and the current year';
    }

    if (data.description && (typeof data.description !== 'string' || data.description.trim() === '')) {
        return 'Description, if provided, must be a non-empty string';
    }

    return null;
};
