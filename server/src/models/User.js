const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email jest wymagany'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Podaj prawidłowy adres email']
    },
    password: {
        type: String,
        required: [true, 'Hasło jest wymagane'],
        minlength: [6, 'Hasło musi mieć minimum 6 znaków']
    },
    role: {
        type: String,
        enum: ['User', 'Librarian', 'Admin'],
        default: 'User'
    },
    name: {
        type: String,
        required: [true, 'Imię jest wymagane'],
        trim: true
    },
    surname: {
        type: String,
        required: [true, 'Nazwisko jest wymagane'],
        trim: true
    },
    phoneNumber: {
        type: String,
        required: false,
        trim: true
    },
    birthDate: {
        type: Date,
        required: false
    },
    borrowedBooks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }],
    reservedBooks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }],
    debt: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Generate random membership ID
function generateMembershipId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < 6; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

// Add membershipId field
userSchema.add({
    membershipId: {
        type: String,
        unique: true,
        required: true,
        default: generateMembershipId
    }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
