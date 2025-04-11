const express = require('express');
const router = express.Router();
const { getAllBooks, fetchBooksFromOpenLibrary, addBook, updateBook } = require('../controllers/bookControllers');

// GET: All books from MongoDB
router.get('/', getAllBooks);

// GET: Search books from Open Library
router.get('/search', fetchBooksFromOpenLibrary);

// POST: Add a new book to MongoDB
router.post('/', addBook);

// PUT: Update a book in MongoDB
router.put('/:id', updateBook); // 👈 Yeh naya line add hua

module.exports = router;
