const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const userController = require('../controllers/userController');

// User routes
router.get('/profile', auth, userController.getProfile);
router.put('/profile', auth, userController.updateProfile);
router.put('/change-password', auth, userController.changePassword);
router.get('/my-books', auth, userController.getMyBooks);
router.post('/extend-borrowing/:id', auth, userController.extendBorrowing);
router.post('/delete-account', auth, userController.deleteAccount);

// Admin routes
router.get('/', auth, checkRole(['Admin']), userController.getAllUsers);
router.put('/:id/role', auth, checkRole(['Admin']), userController.updateUserRole);
// Wyszukiwanie użytkownika po membershipID
router.get('/', auth, checkRole(['Admin']), userController.findByMembershipId);
// Endpoint do zmiany roli po membershipID
router.put('/change-role', auth, checkRole(['Admin']), userController.updateUserRoleByMembershipId);

module.exports = router;
