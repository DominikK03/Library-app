const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true
    },
    productionYear: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ['Available', 'Borrowed', 'Reserved'],
        default: 'Available'
    },
    borrowedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    reservedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    borrowTime: {
        type: Date,
        default: null
    },
    reservationTime: {
        type: Date,
        default: null
    },
    dueDate: {
        type: Date,
        default: null
    },
    reservationExpires: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);
