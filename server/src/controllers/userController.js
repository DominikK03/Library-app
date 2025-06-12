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
        res.json({
            borrowedBooks: user.borrowedBooks,
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
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}; 