const User = require('../models/User');
const Book = require('../models/Book');

class UserService {
    static async getProfile(userId) {
        return User.findById(userId)
            .select('-password')
            .populate('borrowedBooks')
            .populate('reservedBooks');
    }

    static async updateProfile(userId, data) {
        const { name, surname, phoneNumber, birthDate } = data;
        return User.findByIdAndUpdate(
            userId,
            { name, surname, phoneNumber, birthDate },
            { new: true }
        ).select('-password');
    }

    static async changePassword(userId, currentPassword, newPassword) {
        const user = await User.findById(userId);
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) return false;
        user.password = newPassword;
        await user.save();
        return true;
    }

    static async getMyBooks(userId) {
        const user = await User.findById(userId)
            .populate('borrowedBooks')
            .populate('reservedBooks');

        const borrowedBooks = user.borrowedBooks.map(book => {
            let dueDate = book.dueDate;
            if (!dueDate && book.borrowTime) {
                const borrowTime = new Date(book.borrowTime);
                borrowTime.setDate(borrowTime.getDate() + 30);
                dueDate = borrowTime;
            }
            return { ...book.toObject(), dueDate };
        });

        return {
            borrowedBooks,
            reservedBooks: user.reservedBooks
        };
    }

    static async getAllUsers() {
        return User.find().select('-password');
    }

    static async updateUserRole(userId, role) {
        const user = await User.findById(userId);
        if (!user) return { error: 'not_found' };
        if (user.role === 'Admin') return { error: 'admin_forbidden' };
        user.role = role;
        await user.save();
        return user;
    }

    static async updateUserRoleByMembershipId(membershipId, role) {
        if (!membershipId || !role) return { error: 'missing_data' };
        const user = await User.findOne({ membershipId: membershipId.trim().toUpperCase() });
        if (!user) return { error: 'not_found' };
        if (user.role === 'Admin') return { error: 'admin_forbidden' };
        user.role = role;
        await user.save();
        return user;
    }

    static async deleteAccount(userId, password) {
        const user = await User.findById(userId);
        if (!user) return { error: 'not_found' };
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return { error: 'wrong_password' };
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
        await User.findByIdAndDelete(user._id);
        return true;
    }

    static async findByMembershipId(membershipId) {
        if (!membershipId) return { error: 'missing_id' };
        const user = await User.findOne({ membershipId: membershipId.trim().toUpperCase() }).select('-password');
        if (!user) return { error: 'not_found' };
        return user;
    }
}

module.exports = UserService;
