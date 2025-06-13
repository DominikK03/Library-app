const AuthService = require('../services/AuthService');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register new user
exports.register = async (req, res) => {
    try {
        const { email, password, name, surname } = req.body;
        const result = await AuthService.register({ email, password, name, surname });
        if (result.error === 'user_exists') {
            return res.status(400).json({ message: 'Użytkownik o podanym adresie email już istnieje' });
        }
        res.status(201).json(result);
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({ 
                message: 'Błąd walidacji danych',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }
        res.status(500).json({ message: 'Błąd serwera' });
    }
};

// Login user
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await AuthService.login({ email, password });
        if (result.error === 'invalid_credentials') {
            return res.status(400).json({ message: 'Nieprawidłowy email lub hasło' });
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Błąd serwera' });
    }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
    try {
        const user = await AuthService.getCurrentUser(req.user.userId);
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Błąd serwera' });
    }
};
