const BookService = require('../services/BookService');
const Book = require('../models/Book');
const User = require('../models/User');
const { validateBookData } = require('../validators/bookValidator');

// Get all books
exports.getAllBooks = async (req, res) => {
    try {
        const books = await BookService.getAllBooks(req.query);
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single book
exports.getBook = async (req, res) => {
    try {
        const book = await BookService.getBookById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Create book (Admin/Librarian only)
exports.createBook = async (req, res) => {
    try {
        const validationError = validateBookData(req.body);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const { name, author, genre, productionYear, description } = req.body;

        const existingBook = await BookService.findBookByName(name);
        if (existingBook) {
            return res.status(400).json({ message: 'Book with this name already exists' });
        }

        // Prawidłowe przetwarzanie gatunków - usuwamy puste stringi
        let genresArray;
        if (typeof genre === 'string') {
            genresArray = genre.split(',').map(g => g.trim()).filter(g => g !== '');
        } else if (Array.isArray(genre)) {
            genresArray = genre.filter(g => g && typeof g === 'string' && g.trim() !== '');
        } else {
            genresArray = [];
        }

        const book = await BookService.createBook({
            name,
            author,
            genre: genresArray,
            productionYear: Number(productionYear),
            description
        });
        res.status(201).json(book);
    } catch (error) {
        console.error('Error creating book:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update book (Admin/Librarian only)
exports.updateBook = async (req, res) => {
    try {
        const book = await BookService.updateBook(req.params.id, req.body);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete book (Admin/Librarian only)
exports.deleteBook = async (req, res) => {
    try {
        const book = await BookService.deleteBook(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json({ message: 'Book deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Reserve book
exports.reserveBook = async (req, res) => {
    try {
        const book = await BookService.reserveBook(req.params.id, req.user.userId);
        if (book === null) {
            return res.status(404).json({ message: 'Book not found' });
        }
        if (book === false) {
            return res.status(400).json({ message: 'Book is not available' });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Borrow book
exports.borrowBook = async (req, res) => {
    try {
        const book = await BookService.borrowBook(req.params.id, req.user.userId);
        if (book === null) {
            return res.status(404).json({ message: 'Book not found' });
        }
        if (book === false) {
            return res.status(400).json({ message: 'Book is not available' });
        }
        if (book === 'forbidden') {
            return res.status(403).json({ message: 'Book is reserved by another user' });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Return book
exports.returnBook = async (req, res) => {
    try {
        const book = await BookService.returnBook(req.params.id, req.user.userId);
        if (book === null) {
            return res.status(404).json({ message: 'Book not found' });
        }
        if (book === false) {
            return res.status(400).json({ message: 'Book is not borrowed by you' });
        }
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Extend borrow
exports.extendBorrow = async (req, res) => {
    try {
        const bookId = req.params.id;
        const { days } = req.body;
        const userId = req.user.id;
        const result = await BookService.extendBorrow(bookId, userId, days);
        if (result && result.error === 'invalid_days') {
            return res.status(400).json({ message: 'Podaj poprawną liczbę dni' });
        }
        if (!result) {
            return res.status(404).json({ message: 'Nie znaleziono wypożyczonej książki' });
        }
        res.json({ message: 'Przedłużono wypożyczenie', dueDate: result.dueDate, debt: result.debt });
    } catch (error) {
        res.status(500).json({ message: 'Błąd serwera' });
    }
};

// Librarian: pobierz zarezerwowane książki użytkownika po emailu
exports.getReservedBooksByUser = async (req, res) => {
    try {
        const { email } = req.query;
        const result = await BookService.getReservedBooksByUserEmail(email);
        if (result.error === 'no_email') {
            return res.status(400).json({ message: 'Podaj adres email' });
        }
        if (result.error === 'user_not_found') {
            return res.status(404).json({ message: 'Nie znaleziono użytkownika o podanym adresie email.' });
        }
        if (result.error === 'not_reader') {
            return res.status(400).json({ message: 'Podany użytkownik nie jest czytelnikiem.' });
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Błąd serwera' });
    }
};

// Librarian: pobierz zarezerwowane książki użytkownika po membershipID (POST, membershipId w body)
exports.getReservedBooksByMembershipId = async (req, res) => {
    try {
        const { membershipId } = req.body;
        const result = await BookService.getReservedBooksByMembershipId(membershipId);
        if (result.error === 'no_membershipId') {
            return res.status(400).json({ message: 'Podaj membershipID' });
        }
        if (result.error === 'user_not_found') {
            return res.status(404).json({ message: 'Nie znaleziono użytkownika o podanym membershipID.' });
        }
        if (result.error === 'not_reader') {
            return res.status(400).json({ message: 'Podany użytkownik nie jest czytelnikiem.' });
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Błąd serwera' });
    }
};

// Librarian: zmień status z Reserved na Borrowed i ustaw borrowTime
exports.librarianBorrowBook = async (req, res) => {
    try {
        const result = await BookService.librarianBorrowBook(req.params.id);
        if (result.error === 'not_found') {
            return res.status(404).json({ message: 'Nie znaleziono książki' });
        }
        if (result.error === 'not_reserved') {
            return res.status(400).json({ message: 'Książka nie jest zarezerwowana' });
        }
        if (result.error === 'user_not_found') {
            return res.status(404).json({ message: 'Nie znaleziono użytkownika' });
        }
        if (result.error === 'server_error') {
            return res.status(500).json({ message: 'Błąd serwera', details: result.details });
        }
        // Sukces: zwróć aktualny stan książki i użytkownika
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Błąd serwera' });
    }
};

// Pobierz książki wypożyczone i zarezerwowane przez aktualnego użytkownika
exports.getMyBooks = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ message: 'Brak autoryzacji użytkownika (userId nie znaleziony w tokenie JWT)' });
        }
        const borrowedBooks = await Book.find({
            borrowedBy: userId,
            status: 'Borrowed'
        });
        const reservedBooks = await Book.find({
            reservedBy: userId,
            status: 'Reserved'
        });
        res.json({ borrowedBooks, reservedBooks });
    } catch (error) {
        res.status(500).json({ message: 'Błąd serwera', error: error.message });
    }
};
