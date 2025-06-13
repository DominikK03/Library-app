const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/users');
const ReservationService = require('./services/ReservationService');

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

//  Sprawdzanie wygasłych rezerwacji co minutę
if (typeof setInterval !== 'undefined') {
    setInterval(async () => {
        try {
            await ReservationService.expireReservations();
        } catch (err) {
            console.error('Błąd podczas wygaszania rezerwacji:', err);
        }
    }, 60 * 1000); // co minutę
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
