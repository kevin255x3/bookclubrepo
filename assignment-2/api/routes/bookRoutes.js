// defines api endpoints for book operations
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// GET /api/books - get all books (with optional filtering)
router.get('/', bookController.getAllBooks);

// GET /api/books/:id - get a single book by ID
router.get('/:id', bookController.getBookById);

// POST /api/books - create a new book
router.post('/', bookController.uploadMiddleware, bookController.createBook);

// PUT /api/books/:id - update an existing book
router.put('/:id', bookController.uploadMiddleware, bookController.updateBook);

// DELETE /api/books/:id - delete a book
router.delete('/:id', bookController.deleteBook);

module.exports = router;