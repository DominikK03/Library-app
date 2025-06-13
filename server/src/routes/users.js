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
// Bibliotekarz: pobierz wypożyczone książki użytkownika po membershipId
router.get('/borrowed-books-by-membership/:membershipId', auth, checkRole(['Librarian', 'Admin']), userController.getBorrowedBooksByMembershipId);
// Bibliotekarz: zwrot książki
router.post('/return-book/:bookId', auth, checkRole(['Librarian', 'Admin']), userController.librarianReturnBook);

module.exports = router;
