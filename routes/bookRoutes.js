const express = require('express');
const router = express.Router();
const { getAllBooks, fetchBooksFromOpenLibrary, addBook } = require('../controllers/bookControllers');

// GET: All books from MongoDB
router.get('/', getAllBooks);

// GET: Search books from Open Library
router.get('/search', fetchBooksFromOpenLibrary);

// POST: Add a new book to MongoDB
router.post('/', addBook);

module.exports = router;
