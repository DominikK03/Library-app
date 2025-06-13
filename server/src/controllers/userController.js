const UserService = require('../services/UserService');
const Book = require('../models/Book');
const BookService = require('../services/BookService');
const User = require('../models/User');
const mongoose = require('mongoose');

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await UserService.getProfile(req.user.userId);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const user = await UserService.updateProfile(req.user.userId, req.body);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const success = await UserService.changePassword(req.user.userId, currentPassword, newPassword);
        if (!success) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user's books
exports.getMyBooks = async (req, res) => {
    try {
        const result = await UserService.getMyBooks(req.user.userId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Extend borrowing period
exports.extendBorrowing = async (req, res) => {
    try {
        const { days } = req.body;
        const bookId = req.params.id;
        const userId = req.user.userId;

        // Convert bookId to ObjectId
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).json({ message: 'Invalid book ID' });
        }
        const objectId = mongoose.Types.ObjectId(bookId);

        const book = await Book.findById(objectId);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.status !== 'Borrowed' || String(book.borrowedBy) !== String(userId)) {
            return res.status(400).json({ message: 'Book is not borrowed by you' });
        }

        const result = await BookService.extendBorrow(bookId, userId, days);

        if (result && result.error === 'invalid_days') {
            return res.status(400).json({ message: 'Invalid number of days' });
        }

        if (result && result.error === 'exceeds_max_days') {
            return res.status(400).json({ message: 'Cannot extend borrowing by more than 30 days' });
        }

        if (result && result.error === 'book_not_borrowed') {
            return res.status(400).json({ message: 'Book is not borrowed by the user' });
        }

        if (!result) {
            return res.status(404).json({ message: 'Book not found or not borrowed by user' });
        }

        res.json({ message: 'Borrowing period extended', dueDate: result.dueDate, debt: result.debt });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await UserService.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user role (Admin only)
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const result = await UserService.updateUserRole(req.params.id, role);
        if (result.error === 'not_found') {
            return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
        }
        if (result.error === 'admin_forbidden') {
            return res.status(403).json({ message: 'Nie można zmienić roli innemu administratorowi.' });
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Zmiana roli użytkownika po membershipID (Admin only)
exports.updateUserRoleByMembershipId = async (req, res) => {
    try {
        const { membershipId, role } = req.body;
        const result = await UserService.updateUserRoleByMembershipId(membershipId, role);
        if (result.error === 'missing_data') {
            return res.status(400).json({ message: 'membershipID i rola są wymagane.' });
        }
        if (result.error === 'not_found') {
            return res.status(404).json({ message: 'Nie znaleziono użytkownika o podanym membershipID.' });
        }
        if (result.error === 'admin_forbidden') {
            return res.status(403).json({ message: 'Nie można zmienić roli innemu administratorowi.' });
        }
        res.json({ message: 'Rola została zmieniona!', user: result });
    } catch (error) {
        res.status(500).json({ message: 'Błąd serwera.' });
    }
};

// Delete user account
exports.deleteAccount = async (req, res) => {
    try {
        const { password } = req.body;
        const result = await UserService.deleteAccount(req.user.userId, password);
        if (result.error === 'not_found') {
            return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
        }
        if (result.error === 'wrong_password') {
            return res.status(400).json({ message: 'Błędne hasło' });
        }
        res.json({ message: 'Konto zostało usunięte' });
    } catch (error) {
        res.status(500).json({ message: 'Błąd serwera' });
    }
};

// Wyszukiwanie użytkownika po membershipID (dla admina)
exports.findByMembershipId = async (req, res) => {
    try {
        const { membershipId } = req.query;
        const result = await UserService.findByMembershipId(membershipId);
        if (result.error === 'missing_id') {
            return res.status(400).json({ message: 'Brak membershipID w zapytaniu.' });
        }
        if (result.error === 'not_found') {
            return res.status(404).json({ message: 'Nie znaleziono użytkownika o podanym membershipID.' });
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Błąd serwera.' });
    }
};

// Pobierz wypożyczone książki użytkownika po membershipId (dla bibliotekarza)
exports.getBorrowedBooksByMembershipId = async (req, res) => {
    try {
        const { membershipId } = req.params;
        if (!membershipId) {
            return res.status(400).json({ message: 'Brak membershipId w zapytaniu.' });
        }
        const user = await User.findOne({ membershipId });
        if (!user) {
            return res.status(404).json({ message: 'Nie znaleziono użytkownika o podanym membershipId.' });
        }
        await user.populate('borrowedBooks');
        res.json({
            user: {
                id: user._id,
                name: user.name,
                surname: user.surname,
                membershipId: user.membershipId
            },
            borrowedBooks: user.borrowedBooks
        });
    } catch (error) {
        res.status(500).json({ message: 'Błąd serwera.' });
    }
};

// Zwrot książki przez bibliotekarza
exports.librarianReturnBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Nie znaleziono książki.' });
        }
        // Zapamiętaj użytkownika przed resetem pól
        const prevBorrowedBy = book.borrowedBy;
        const prevReservedBy = book.reservedBy;
        // Resetuj wszystkie powiązania i daty
        book.status = 'Available';
        book.borrowedBy = null;
        book.borrowTime = null;
        book.dueDate = null;
        book.reservedBy = null;
        book.reservationTime = null;
        book.reservationExpires = null;
        await book.save();
        // Usuń książkę z tablic borrowedBooks i reservedBooks użytkownika
        if (prevBorrowedBy) {
            await User.findByIdAndUpdate(prevBorrowedBy, { $pull: { borrowedBooks: book._id } });
        }
        if (prevReservedBy) {
            await User.findByIdAndUpdate(prevReservedBy, { $pull: { reservedBooks: book._id } });
        }
        res.json({ message: 'Książka została zwrócona i jest dostępna.' });
    } catch (error) {
        res.status(500).json({ message: 'Błąd serwera.' });
    }
};
