const mongoose = require('mongoose');
const Book = require('../models/Book');
require('dotenv').config();

const books = [
  // Fantasy
  {
    name: 'Władca Pierścieni',
    author: 'J.R.R. Tolkien',
    genre: ['Fantasy', 'Przygodowa', 'High fantasy'],
    productionYear: 1954,
    description: 'Epicka powieść fantasy opowiadająca o misji zniszczenia potężnego pierścienia.',
    status: 'Available',
    borrowedBy: null,
    reservedBy: null,
    borrowTime: null,
    reservationTime: null
  },
  {
    name: 'Harry Potter i Kamień Filozoficzny',
    author: 'J.K. Rowling',
    genre: ['Fantasy', 'Przygodowa', 'Young Adult'],
    productionYear: 1997,
    description: 'Pierwsza część serii o młodym czarodzieju Harrym Potterze.',
    status: 'Available',
    borrowedBy: null,
    reservedBy: null,
    borrowTime: null,
    reservationTime: null
  },
  {
    name: 'Gra o Tron',
    author: 'George R.R. Martin',
    genre: ['Fantasy', 'Powieść historyczna', 'Dark fantasy'],
    productionYear: 1996,
    description: 'Pierwsza część sagi Pieśni Lodu i Ognia.',
    status: 'Available',
    borrowedBy: null,
    reservedBy: null,
    borrowTime: null,
    reservationTime: null
  },
  {
    name: 'Wiedźmin',
    author: 'Andrzej Sapkowski',
    genre: ['Fantasy', 'Przygodowa', 'Literatura polska'],
    productionYear: 1990,
    description: 'Saga o wiedźminie Geralcie z Rivii.',
    status: 'Available',
    borrowedBy: null,
    reservedBy: null,
    borrowTime: null,
    reservationTime: null
  },

  // Science Fiction
  {
    name: '1984',
    author: 'George Orwell',
    genre: ['Sci-Fi', 'Dystopia', 'Literatura brytyjska'],
    productionYear: 1949,
    description: 'Dystopijna powieść o totalitarnym społeczeństwie.',
    status: 'Available',
    borrowedBy: null,
    reservedBy: null,
    borrowTime: null,
    reservationTime: null
  },
  {
    name: 'Solaris',
    author: 'Stanisław Lem',
    genre: ['Sci-Fi', 'Literatura polska', 'Hard sci-fi'],
    productionYear: 1961,
    description: 'Powieść science fiction o kontakcie z obcą formą życia.',
    status: 'Available',
    borrowedBy: null,
    reservedBy: null,
    borrowTime: null,
    reservationTime: null
  },
  {
    name: 'Dune',
    author: 'Frank Herbert',
    genre: ['Sci-Fi', 'Przygodowa', 'Space opera'],
    productionYear: 1965,
    description: 'Epicka powieść science fiction o pustynnej planecie Arrakis.',
    status: 'Available',
    borrowedBy: null,
    reservedBy: null,
    borrowTime: null,
    reservationTime: null
  },
  {
    name: 'Neuromancer',
    author: 'William Gibson',
    genre: ['Sci-Fi', 'Cyberpunk'],
    productionYear: 1984,
    description: 'Kultowa powieść cyberpunkowa.',
    status: 'Available',
    borrowedBy: null,
    reservedBy: null,
    borrowTime: null,
    reservationTime: null
  },

  // Literatura Klasyczna
  {
    name: 'Zbrodnia i Kara',
    author: 'Fiodor Dostojewski',
    genre: ['Klasyka', 'Literatura rosyjska', 'Powieść psychologiczna'],
    productionYear: 1866,
    description: 'Powieść psychologiczna o zbrodni i odkupieniu.',
    status: 'Available',
    borrowedBy: null,
    reservedBy: null,
    borrowTime: null,
    reservationTime: null
  },
  {
    name: 'Lalka',
    author: 'Bolesław Prus',
    genre: ['Literatura polska', 'Klasyka', 'Powieść historyczna'],
    productionYear: 1890,
    description: 'Powieść realistyczna o miłości i społeczeństwie.',
    status: 'Available',
    borrowedBy: null,
    reservedBy: null,
    borrowTime: null,
    reservationTime: null
  },
  {
    name: 'Pan Tadeusz',
    author: 'Adam Mickiewicz',
    genre: ['Literatura polska', 'Klasyka', 'Poezja'],
    productionYear: 1834,
    description: 'Epopeja narodowa opisująca życie szlachty polskiej.',
    status: 'Available',
    borrowedBy: null,
    reservedBy: null,
    borrowTime: null,
    reservationTime: null
  },
  {
    name: 'Quo Vadis',
    author: 'Henryk Sienkiewicz',
    genre: ['Literatura polska', 'Powieść historyczna', 'Klasyka'],
    productionYear: 1896,
    description: 'Powieść historyczna o czasach Nerona.',
    status: 'Available',
    borrowedBy: null,
    reservedBy: null,
    borrowTime: null,
    reservationTime: null
  },

  // Romans
  {
    name: 'Duma i Uprzedzenie',
    author: 'Jane Austen',
    genre: ['Romans', 'Klasyka', 'Literatura brytyjska'],
    productionYear: 1813,
    description: 'Klasyczna powieść obyczajowa o miłości i konwenansach.',
    status: 'Available',
    borrowedBy: null,
    reservedBy: null,
    borrowTime: null,
    reservationTime: null
  },
  {
    name: 'Jane Eyre',
    author: 'Charlotte Brontë',
    genre: ['Romans', 'Klasyka', 'Literatura brytyjska'],
    productionYear: 1847,
    description: 'Powieść o miłości i niezależności młodej guwernantki.',
    status: 'Available',
    borrowedBy: null,
    reservedBy: null,
    borrowTime: null,
    reservationTime: null
  },
  {
    name: 'Wichrowe Wzgórza',
    author: 'Emily Brontë',
    genre: ['Romans', 'Klasyka', 'Literatura brytyjska', 'Powieść gotycka'],
    productionYear: 1847,
    description: 'Burzliwa historia miłości i zemsty.',
    status: 'Available',
    borrowedBy: null,
    reservedBy: null,
    borrowTime: null,
    reservationTime: null
  },

  // Kryminał
  {
    name: 'Zbrodnia w Orient Expressie',
    author: 'Agatha Christie',
    genre: ['Kryminał', 'Powieść detektywistyczna'],
    productionYear: 1934,
    description: 'Klasyczny kryminał z Herkulesem Poirot.',
    status: 'Available',
    borrowedBy: null,
    reservedBy: null,
    borrowTime: null,
    reservationTime: null
  },
  {
    name: 'Sherlock Holmes',
    author: 'Arthur Conan Doyle',
    genre: ['Kryminał', 'Powieść detektywistyczna', 'Literatura brytyjska'],
    productionYear: 1887,
    description: 'Zbiór opowiadań o genialnym detektywie.',
    status: 'Available',
    borrowedBy: null,
    reservedBy: null,
    borrowTime: null,
    reservationTime: null
  },
  {
    name: 'Millennium',
    author: 'Stieg Larsson',
    genre: ['Kryminał', 'Thriller'],
    productionYear: 2005,
    description: 'Pierwsza część trylogii o Lisbeth Salander.',
    status: 'Available',
    borrowedBy: null,
    reservedBy: null,
    borrowTime: null,
    reservationTime: null
  },

  // Literatura Dziecięca
  {
    name: 'Mały Książę',
    author: 'Antoine de Saint-Exupéry',
    genre: ['Literatura dziecięca', 'Baśń', 'Literatura francuska'],
    productionYear: 1943,
    description: 'Filozoficzna baśń o przyjaźni i miłości.',
    status: 'Available',
    borrowedBy: null,
    reservedBy: null,
    borrowTime: null,
    reservationTime: null
  },
  {
    name: 'Alicja w Krainie Czarów',
    author: 'Lewis Carroll',
    genre: ['Literatura dziecięca', 'Fantasy', 'Klasyka'],
    productionYear: 1865,
    description: 'Fantastyczna opowieść o przygodach Alicji.',
    status: 'Available',
    borrowedBy: null,
    reservedBy: null,
    borrowTime: null,
    reservationTime: null
  },
  {
    name: 'Kubuś Puchatek',
    author: 'A.A. Milne',
    genre: ['Literatura dziecięca', 'Klasyka', 'Literatura brytyjska'],
    productionYear: 1926,
    description: 'Urocza historia o przygodach misia i jego przyjaciół.',
    status: 'Available',
    borrowedBy: null,
    reservedBy: null,
    borrowTime: null,
    reservationTime: null
  },

  // Literatura Współczesna
  {
    name: 'Cień Wiatru',
    author: 'Carlos Ruiz Zafón',
    genre: ['Literatura piękna', 'Thriller', 'Literatura hiszpańska'],
    productionYear: 2001,
    description: 'Tajemnicza historia o książce i jej autorze.',
    status: 'Available',
    borrowedBy: null,
    reservedBy: null,
    borrowTime: null,
    reservationTime: null
  },
  {
    name: 'Sto lat samotności',
    author: 'Gabriel García Márquez',
    genre: ['Literatura latynoamerykańska', 'Realizm magiczny'],
    productionYear: 1967,
    description: 'Realistyczno-magiczna saga rodzinna.',
    status: 'Available',
    borrowedBy: null,
    reservedBy: null,
    borrowTime: null,
    reservationTime: null
  },
  {
    name: 'Imię Róży',
    author: 'Umberto Eco',
    genre: ['Literatura piękna', 'Kryminał', 'Powieść historyczna'],
    productionYear: 1980,
    description: 'Kryminał historyczny w średniowiecznym opactwie.',
    status: 'Available',
    borrowedBy: null,
    reservedBy: null,
    borrowTime: null,
    reservationTime: null
  }
];

// Generowanie dodatkowych książek
const genreOptions = [
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

const authors = [
  'Stephen King', 'Neil Gaiman', 'Terry Pratchett', 'Philip K. Dick', 'Isaac Asimov',
  'Fiodor Dostojewski', 'Lew Tołstoj', 'Anton Czechow', 'Marcel Proust', 'James Joyce',
  'Virginia Woolf', 'Ernest Hemingway', 'William Faulkner', 'John Steinbeck', 'F. Scott Fitzgerald',
  'J.R.R. Tolkien', 'C.S. Lewis', 'George R.R. Martin', 'Brandon Sanderson', 'Patrick Rothfuss',
  'Stanisław Lem', 'Arthur C. Clarke', 'Robert A. Heinlein', 'Frank Herbert',
  'Agatha Christie', 'Raymond Chandler', 'Dashiell Hammett', 'James Ellroy', 'Michael Connelly',
  'Astrid Lindgren', 'Roald Dahl', 'Michael Ende', 'Cornelia Funke', 'J.K. Rowling',
  'Paulo Coelho', 'Haruki Murakami', 'Orhan Pamuk', 'Jhumpa Lahiri', 'Chimamanda Ngozi Adichie',
  'Olga Tokarczuk', 'Andrzej Sapkowski', 'Wiesław Myśliwski', 'Umberto Eco', 'Gabriel García Márquez',
  'Jorge Luis Borges', 'Italo Calvino', 'Yukio Mishima', 'Banana Yoshimoto', 'Kazuo Ishiguro',
  'Margaret Atwood', 'Zadie Smith', 'Salman Rushdie', 'Ian McEwan', 'Milan Kundera'
];

// Generowanie losowych książek z rozszerzoną listą gatunków
for (let i = 0; i < 80; i++) {
  // Wybierz 1-3 losowe gatunki bez powtórzeń
  const numGenres = Math.floor(Math.random() * 3) + 1; // 1, 2 lub 3 gatunki
  const bookGenres = [];

  // Tworzymy kopię tablicy gatunków, aby móc z niej usuwać elementy
  const availableGenres = [...genreOptions];

  for (let j = 0; j < numGenres; j++) {
    if (availableGenres.length === 0) break;

    const randomIndex = Math.floor(Math.random() * availableGenres.length);
    bookGenres.push(availableGenres[randomIndex]);

    // Usuwamy wybrany gatunek, aby uniknąć powtórzeń
    availableGenres.splice(randomIndex, 1);
  }

  const author = authors[Math.floor(Math.random() * authors.length)];
  const year = Math.floor(Math.random() * (2024 - 1900) + 1900);

  books.push({
    name: `Książka ${i + 1}`,
    author: author,
    genre: bookGenres,
    productionYear: year,
    description: `Opis książki ${i + 1} z gatunków ${bookGenres.join(', ')} autorstwa ${author}.`,
    status: 'Available',
    borrowedBy: null,
    reservedBy: null,
    borrowTime: null,
    reservationTime: null
  });
}

const seedBooks = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await Book.deleteMany({});

    await Book.insertMany(books);

    console.log('Dodano książki do bazy danych!');

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding books:', error);
    process.exit(1);
  }
};

seedBooks();
