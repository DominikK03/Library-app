const Book = require('../models/Book');

class ReservationService {
    static async expireReservations() {
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
    }

    static async removeExpiredReservations() {
        const expiredBooks = await Book.updateMany(
            { reservationExpires: { $lt: new Date() } },
            { $set: { status: 'Available', reservedBy: null, reservationExpires: null } }
        );
        return expiredBooks;
    }
}

module.exports = ReservationService;
