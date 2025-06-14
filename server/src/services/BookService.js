const Book = require('../models/Book');
const User = require('../models/User');

class BookService {
    static async getAllBooks({ search, genre }) {
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
        return Book.find(query);
    }

    static async getBookById(id) {
        return Book.findById(id);
    }

    static async createBook(data) {
        const { name, author, genre, productionYear, description } = data;
        const book = new Book({ name, author, genre, productionYear, description });
        return book.save();
    }

    static async updateBook(id, data) {
        const { name, author, genre, productionYear, description } = data;
        return Book.findByIdAndUpdate(
            id,
            { name, author, genre, productionYear, description },
            { new: true }
        );
    }

    static async deleteBook(id) {
        return Book.findByIdAndDelete(id);
    }

    static async reserveBook(bookId, userId) {
        const book = await Book.findById(bookId);
        if (!book) return null;
        if (book.status !== 'Available') return false;
        book.status = 'Reserved';
        book.reservedBy = userId;
        book.reservationTime = new Date();
        book.reservationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await book.save();
        await User.findByIdAndUpdate(userId, { $push: { reservedBooks: book._id } });
        return book;
    }

    static async borrowBook(bookId, userId) {
        const book = await Book.findById(bookId);
        if (!book) return null;
        if (book.status !== 'Available' && book.status !== 'Reserved') return false;
        if (book.status === 'Reserved' && String(book.reservedBy) !== String(userId)) return 'forbidden';
        book.status = 'Borrowed';
        book.borrowedBy = userId;
        book.borrowTime = new Date();
        book.reservedBy = null;
        book.reservationTime = null;
        await book.save();
        await User.findByIdAndUpdate(userId, {
            $push: { borrowedBooks: book._id },
            $pull: { reservedBooks: book._id }
        });
        return book;
    }

    static async returnBook(bookId, userId) {
        const book = await Book.findById(bookId);
        if (!book) return null;
        if (book.status !== 'Borrowed' || String(book.borrowedBy) !== String(userId)) return false;
        book.status = 'Available';
        book.borrowedBy = null;
        book.borrowTime = null;
        await book.save();
        await User.findByIdAndUpdate(userId, { $pull: { borrowedBooks: book._id } });
        return book;
    }

    static async extendBorrow(bookId, userId, days) {
        if (!days || days < 1) return { error: 'invalid_days' };
        if (days > 30) return { error: 'exceeds_max_days' };
        try {
            const book = await Book.findById(bookId);
            if (!book || String(book.borrowedBy) !== String(userId)) return { error: 'book_not_borrowed' };
            const now = new Date();
            let newDueDate = book.dueDate && book.dueDate > now ? new Date(book.dueDate) : now;
            newDueDate.setDate(newDueDate.getDate() + days);
            book.dueDate = newDueDate;
            await book.save();
            const user = await User.findById(userId);
            user.debt += days;
            await user.save();
            return { dueDate: book.dueDate, debt: user.debt };
        } catch (err) {
            throw err;
        }
    }

    static async getReservedBooksByUserEmail(email) {
        if (!email) return { error: 'no_email' };
        const searchEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: searchEmail });
        if (!user) return { error: 'user_not_found' };
        if (user.role !== 'User') return { error: 'not_reader' };
        const books = await Book.find({ reservedBy: user._id, status: 'Reserved' });
        return { books, user };
    }

    static async getReservedBooksByMembershipId(membershipId) {
        if (!membershipId) return { error: 'no_membershipId' };
        const user = await User.findOne({ membershipId: membershipId.trim().toUpperCase() });
        if (!user) return { error: 'user_not_found' };
        if (user.role !== 'User') return { error: 'not_reader' };
        const books = await Book.find({ reservedBy: user._id, status: 'Reserved' });
        return { books, user };
    }

    static async librarianBorrowBook(bookId) {
        try {
            const book = await this.findBookById(bookId);
            if (!book) return { error: 'not_found' };

            if (!this.isBookReserved(book)) return { error: 'not_reserved' };

            const user = await this.findUserById(book.reservedBy);
            if (!user) return { error: 'user_not_found' };

            await this.updateBookToBorrowed(book, user._id);
            await this.updateUserBooks(user, book._id);

            return this.formatBorrowResponse(book, user);
        } catch (err) {
            throw err;
        }
    }

    static async findBookById(bookId) {
        return Book.findById(bookId);
    }

    static isBookReserved(book) {
        return book.status === 'Reserved' && book.reservedBy;
    }

    static async findUserById(userId) {
        return User.findById(userId);
    }

    static async updateBookToBorrowed(book, userId) {
        book.status = 'Borrowed';
        book.borrowTime = new Date();
        book.borrowedBy = userId;
        book.reservedBy = null;
        book.reservationTime = null;
        book.reservationExpires = null;
        await book.save();
    }

    static async updateUserBooks(user, bookId) {
        user.reservedBooks.pull(bookId);
        user.borrowedBooks.addToSet(bookId);
        await user.save();
    }

    static formatBorrowResponse(book, user) {
        return {
            book,
            user: {
                id: user._id,
                name: user.name,
                surname: user.surname,
                membershipId: user.membershipId,
                borrowedBooks: user.borrowedBooks,
                reservedBooks: user.reservedBooks
            }
        };
    }

    static async findBookByName(name) {
        return Book.findOne({ name });
    }
}

module.exports = BookService;
