const Book = require('../models/Book');
const User = require('../models/User');

// Get all books
exports.getAllBooks = async (req, res) => {
    try {
        const { search, genre } = req.query;
        let query = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } }
            ];
        }

        if (genre) {
            query.genre = genre;
        }

        const books = await Book.find(query);
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get single book
exports.getBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
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
        const { name, author, genre, productionYear, description } = req.body;
        const book = new Book({
            name,
            author,
            genre,
            productionYear,
            description
        });
        await book.save();
        res.status(201).json(book);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update book (Admin/Librarian only)
exports.updateBook = async (req, res) => {
    try {
        const { name, author, genre, productionYear, description } = req.body;
        const book = await Book.findByIdAndUpdate(
            req.params.id,
            { name, author, genre, productionYear, description },
            { new: true }
        );
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
        const book = await Book.findByIdAndDelete(req.params.id);
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
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.status !== 'Available') {
            return res.status(400).json({ message: 'Book is not available' });
        }

        book.status = 'Reserved';
        book.reservedBy = req.user.userId;
        book.reservationTime = new Date();
        // Ustaw czas wygaśnięcia rezerwacji na 24h
        book.reservationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await book.save();

        // Add to user's reserved books
        await User.findByIdAndUpdate(req.user.userId, {
            $push: { reservedBooks: book._id }
        });

        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Borrow book
exports.borrowBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.status !== 'Available' && book.status !== 'Reserved') {
            return res.status(400).json({ message: 'Book is not available' });
        }

        // Check if user has reserved this book
        if (book.status === 'Reserved' && book.reservedBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Book is reserved by another user' });
        }

        book.status = 'Borrowed';
        book.borrowedBy = req.user.userId;
        book.borrowTime = new Date();
        book.reservedBy = null;
        book.reservationTime = null;
        await book.save();

        // Update user's books
        await User.findByIdAndUpdate(req.user.userId, {
            $push: { borrowedBooks: book._id },
            $pull: { reservedBooks: book._id }
        });

        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Return book
exports.returnBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.status !== 'Borrowed' || book.borrowedBy.toString() !== req.user.userId) {
            return res.status(400).json({ message: 'Book is not borrowed by you' });
        }

        book.status = 'Available';
        book.borrowedBy = null;
        book.borrowTime = null;
        await book.save();

        // Update user's books
        await User.findByIdAndUpdate(req.user.userId, {
            $pull: { borrowedBooks: book._id }
        });

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
        if (!days || days < 1) {
            return res.status(400).json({ message: 'Podaj poprawną liczbę dni' });
        }
        const book = await Book.findById(bookId);
        if (!book || String(book.borrowedBy) !== String(userId)) {
            return res.status(404).json({ message: 'Nie znaleziono wypożyczonej książki' });
        }
        // Ustal nową datę końca wypożyczenia
        const now = new Date();
        let newDueDate = book.dueDate && book.dueDate > now ? new Date(book.dueDate) : now;
        newDueDate.setDate(newDueDate.getDate() + days);
        book.dueDate = newDueDate;
        await book.save();
        // Zwiększ zadłużenie użytkownika
        const user = await User.findById(userId);
        user.debt += days;
        await user.save();
        res.json({ message: 'Przedłużono wypożyczenie', dueDate: book.dueDate, debt: user.debt });
    } catch (error) {
        res.status(500).json({ message: 'Błąd serwera' });
    }
};

// Librarian: pobierz zarezerwowane książki użytkownika po emailu
exports.getReservedBooksByUser = async (req, res) => {
    try {
        const { email } = req.query;
        console.log('Otrzymany email:', email);
        if (!email) {
            console.error('Brak emaila w zapytaniu');
            return res.status(400).json({ message: 'Podaj adres email' });
        }
        const searchEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: searchEmail });
        console.log('Znaleziony user:', user);
        if (!user) {
            console.error('Nie znaleziono użytkownika o emailu:', searchEmail);
            return res.status(404).json({ message: 'Nie znaleziono użytkownika o podanym adresie email.' });
        }
        if (user.role !== 'User') {
            console.error('Użytkownik nie jest czytelnikiem:', user.email);
            return res.status(400).json({ message: 'Podany użytkownik nie jest czytelnikiem.' });
        }
        const books = await Book.find({ reservedBy: user._id, status: 'Reserved' });
        console.log('Zarezerwowane książki:', books);
        res.json({ books, user });
    } catch (error) {
        console.error('Błąd w getReservedBooksByUser:', error, error.stack);
        res.status(500).json({ message: 'Błąd serwera: ' + error.message });
    }
};

// Librarian: pobierz zarezerwowane książki użytkownika po membershipID (POST, membershipId w body)
exports.getReservedBooksByMembershipId = async (req, res) => {
    try {
        const { membershipId } = req.body;
        if (!membershipId) {
            return res.status(400).json({ message: 'Podaj membershipID' });
        }
        const user = await User.findOne({ membershipId: membershipId.trim().toUpperCase() });
        if (!user) {
            return res.status(404).json({ message: 'Nie znaleziono użytkownika o podanym membershipID.' });
        }
        if (user.role !== 'User') {
            return res.status(400).json({ message: 'Podany użytkownik nie jest czytelnikiem.' });
        }
        const books = await Book.find({ reservedBy: user._id, status: 'Reserved' });
        res.json({ books, user });
    } catch (error) {
        res.status(500).json({ message: 'Błąd serwera: ' + error.message });
    }
};

// Librarian: zmień status z Reserved na Borrowed i ustaw borrowTime
exports.librarianBorrowBook = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Nie znaleziono książki' });
        }
        if (book.status !== 'Reserved' || !book.reservedBy) {
            return res.status(400).json({ message: 'Książka nie jest zarezerwowana' });
        }
        // Przenieś rezerwację na wypożyczenie
        const userId = book.reservedBy;
        book.status = 'Borrowed';
        book.borrowTime = new Date();
        book.borrowedBy = userId;
        book.reservedBy = null;
        book.reservationTime = null;
        book.reservationExpires = null;
        await book.save();
        // Zaktualizuj użytkownika: usuń z reservedBooks, dodaj do borrowedBooks
        await User.findByIdAndUpdate(userId, {
            $pull: { reservedBooks: book._id },
            $push: { borrowedBooks: book._id }
        });
        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'Błąd serwera' });
    }
};
