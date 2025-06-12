const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/users');
const Book = require('./models/Book');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Zadanie cykliczne: sprawdzanie wygasłych rezerwacji co minutę
typeof setInterval !== 'undefined' && setInterval(async () => {
    try {
        const now = new Date();
        const expiredBooks = await Book.find({
            status: 'Reserved',
            reservationExpires: { $lte: now }
        });
        for (const book of expiredBooks) {
            book.status = 'Available';
            book.reservedBy = null;
            book.reservationTime = null;
            book.reservationExpires = null;
            await book.save();
        }
        if (expiredBooks.length > 0) {
            console.log(`Zaktualizowano ${expiredBooks.length} książek z wygasłą rezerwacją.`);
        }
    } catch (err) {
        console.error('Błąd podczas wygaszania rezerwacji:', err);
    }
}, 60 * 1000); // co minutę

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
