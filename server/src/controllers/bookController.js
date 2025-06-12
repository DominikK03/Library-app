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