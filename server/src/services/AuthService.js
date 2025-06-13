const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthService {
    static async register({ email, password, name, surname }) {
        let user = await User.findOne({ email });
        if (user) return { error: 'user_exists' };
        user = new User({ email, password, name, surname });
        await user.save();
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        return {
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                name: user.name,
                surname: user.surname
            }
        };
    }

    static async login({ email, password }) {
        const user = await User.findOne({ email });
        if (!user) return { error: 'invalid_credentials' };
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return { error: 'invalid_credentials' };
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        return {
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                name: user.name,
                surname: user.surname
            }
        };
    }

    static async getCurrentUser(userId) {
        return User.findById(userId).select('-password');
    }
}

module.exports = AuthService;

