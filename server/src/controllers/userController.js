const User = require('../models/User');
const Book = require('../models/Book');

// Get user profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select('-password')
            .populate('borrowedBooks')
            .populate('reservedBooks');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user profile
exports.updateProfile = async (req, res) => {
    try {
        const { name, surname, phoneNumber, birthDate } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user.userId,
            { name, surname, phoneNumber, birthDate },
            { new: true }
        ).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Change password
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.userId);

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        user.password = newPassword;
        await user.save();
        res.json({ message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user's books
exports.getMyBooks = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .populate('borrowedBooks')
            .populate('reservedBooks');
        // Upewnij się, że każda książka ma pole dueDate (jeśli nie, wylicz na podstawie borrowTime + 30 dni)
        const borrowedBooks = user.borrowedBooks.map(book => {
            let dueDate = book.dueDate;
            if (!dueDate && book.borrowTime) {
                const borrowTime = new Date(book.borrowTime);
                borrowTime.setDate(borrowTime.getDate() + 30);
                dueDate = borrowTime;
            }
            return { ...book.toObject(), dueDate };
        });
        res.json({
            borrowedBooks,
            reservedBooks: user.reservedBooks
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Extend borrowing period
exports.extendBorrowing = async (req, res) => {
    try {
        const { days } = req.body;
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        if (book.status !== 'Borrowed' || book.borrowedBy.toString() !== req.user.userId) {
            return res.status(400).json({ message: 'Book is not borrowed by you' });
        }

        // Calculate new borrow time
        const newBorrowTime = new Date(book.borrowTime);
        newBorrowTime.setDate(newBorrowTime.getDate() + days);
        book.borrowTime = newBorrowTime;
        await book.save();

        res.json(book);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user role (Admin only)
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
        }
        // Poprawna kolejność: jeśli user jest adminem, nie pozwól na zmianę roli
        if (user.role === 'Admin') {
            return res.status(403).json({ message: 'Nie można zmienić roli innemu administratorowi.' });
        }
        // Jeśli nie jest adminem, pozwól na zmianę roli
        user.role = role;
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// Zmiana roli użytkownika po membershipID (Admin only)
exports.updateUserRoleByMembershipId = async (req, res) => {
    try {
        const { membershipId, role } = req.body;
        if (!membershipId || !role) {
            return res.status(400).json({ message: 'membershipID i rola są wymagane.' });
        }
        const user = await User.findOne({ membershipId: membershipId.trim().toUpperCase() });
        if (!user) {
            return res.status(404).json({ message: 'Nie znaleziono użytkownika o podanym membershipID.' });
        }
        if (user.role === 'Admin') {
            return res.status(403).json({ message: 'Nie można zmienić roli innemu administratorowi.' });
        }
        user.role = role;
        await user.save();
        res.json({ message: 'Rola została zmieniona!', user });
    } catch (error) {
        res.status(500).json({ message: 'Błąd serwera.' });
    }
};

// Delete user account
exports.deleteAccount = async (req, res) => {
    try {
        const { password } = req.body;
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({ message: 'Użytkownik nie znaleziony' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Błędne hasło' });
        }
        // Zmień status książek Reserved/Borrowed na Available
        await Book.updateMany(
            { $or: [
                { borrowedBy: user._id, status: 'Borrowed' },
                { reservedBy: user._id, status: 'Reserved' }
            ] },
            {
                $set: {
                    status: 'Available',
                    borrowedBy: null,
                    reservedBy: null,
                    borrowTime: null,
                    reservationTime: null
                }
            }
        );
        // Usuń użytkownika
        await User.findByIdAndDelete(user._id);
        res.json({ message: 'Konto zostało usunięte' });
    } catch (error) {
        res.status(500).json({ message: 'Błąd serwera' });
    }
};

// Wyszukiwanie użytkownika po membershipID (dla admina)
exports.findByMembershipId = async (req, res) => {
    try {
        const { membershipId } = req.query;
        if (!membershipId) {
            return res.status(400).json({ message: 'Brak membershipID w zapytaniu.' });
        }
        const user = await User.findOne({ membershipId: membershipId.trim().toUpperCase() }).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Nie znaleziono użytkownika o podanym membershipID.' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Błąd serwera.' });
    }
};
