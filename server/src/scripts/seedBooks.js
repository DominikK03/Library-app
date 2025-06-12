const mongoose = require('mongoose');
const Book = require('../models/Book');
require('dotenv').config();

const books = [
  // Fantasy
  {
    name: 'Władca Pierścieni',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
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
    genre: 'Fantasy',
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
    genre: 'Fantasy',
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
    genre: 'Fantasy',
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
    genre: 'Science Fiction',
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
    genre: 'Science Fiction',
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
    genre: 'Science Fiction',
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
    genre: 'Science Fiction',
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
    genre: 'Literatura Klasyczna',
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
    genre: 'Literatura Polska',
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
    genre: 'Literatura Polska',
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
    genre: 'Literatura Polska',
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
    genre: 'Romans',
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
    genre: 'Romans',
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
    genre: 'Romans',
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
    genre: 'Kryminał',
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
    genre: 'Kryminał',
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
    genre: 'Kryminał',
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
    genre: 'Literatura Dziecięca',
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
    genre: 'Literatura Dziecięca',
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
    genre: 'Literatura Dziecięca',
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
    genre: 'Literatura Współczesna',
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
    genre: 'Literatura Współczesna',
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
    genre: 'Literatura Współczesna',
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
const genres = ['Fantasy', 'Science Fiction', 'Literatura Klasyczna', 'Romans', 'Kryminał', 'Literatura Dziecięca', 'Literatura Współczesna', 'Biografia', 'Historia', 'Popularnonaukowa'];
const authors = [
  'Stephen King', 'Neil Gaiman', 'Terry Pratchett', 'Philip K. Dick', 'Isaac Asimov',
  'Fiodor Dostojewski', 'Lew Tołstoj', 'Anton Czechow', 'Marcel Proust', 'James Joyce',
  'Virginia Woolf', 'Ernest Hemingway', 'William Faulkner', 'John Steinbeck', 'F. Scott Fitzgerald',
  'J.R.R. Tolkien', 'C.S. Lewis', 'George R.R. Martin', 'Brandon Sanderson', 'Patrick Rothfuss',
  'Stanisław Lem', 'Philip K. Dick', 'Arthur C. Clarke', 'Robert A. Heinlein', 'Frank Herbert',
  'Agatha Christie', 'Raymond Chandler', 'Dashiell Hammett', 'James Ellroy', 'Michael Connelly',
  'Astrid Lindgren', 'Roald Dahl', 'Michael Ende', 'Cornelia Funke', 'J.K. Rowling',
  'Paulo Coelho', 'Haruki Murakami', 'Orhan Pamuk', 'Jhumpa Lahiri', 'Chimamanda Ngozi Adichie'
];

for (let i = 0; i < 80; i++) {
  const genre = genres[Math.floor(Math.random() * genres.length)];
  const author = authors[Math.floor(Math.random() * authors.length)];
  const year = Math.floor(Math.random() * (2024 - 1900) + 1900);
  
  books.push({
    name: `Książka ${i + 1}`,
    author: author,
    genre: genre,
    productionYear: year,
    description: `Opis książki ${i + 1} z gatunku ${genre} autorstwa ${author}.`,
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
    console.log('Connected to MongoDB');

    await Book.deleteMany({});
    console.log('Cleared existing books');

    await Book.insertMany(books);
    console.log('Books seeded successfully');

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding books:', error);
    process.exit(1);
  }
};

seedBooks(); 