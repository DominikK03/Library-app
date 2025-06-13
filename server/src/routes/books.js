const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth');
const bookController = require('../controllers/bookController');

// Public routes
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBook);

// Protected routes
router.post('/', auth, checkRole(['Admin', 'Librarian']), bookController.createBook);
router.put('/:id', auth, checkRole(['Admin', 'Librarian']), bookController.updateBook);
router.delete('/:id', auth, checkRole(['Admin', 'Librarian']), bookController.deleteBook);

// User routes
router.post('/:id/reserve', auth, bookController.reserveBook);
router.post('/:id/borrow', auth, bookController.borrowBook);
router.post('/:id/return', auth, bookController.returnBook);
router.post('/:id/extend', auth, bookController.extendBorrow);
router.get('/my', auth, bookController.getMyBooks);

// Librarian routes
router.get('/reserved-by-user', auth, checkRole(['Librarian']), bookController.getReservedBooksByUser);
router.post('/reserved-by-membership', auth, checkRole(['Librarian']), bookController.getReservedBooksByMembershipId);
router.post('/:id/librarian-borrow', auth, checkRole(['Librarian']), bookController.librarianBorrowBook);

module.exports = router;
