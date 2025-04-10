const express = require('express');
const router = express.Router();
const { getAllBooks, fetchBooksFromOpenLibrary } = require('../controllers/bookControllers');

// Existing Route (Get all books from MongoDB)
router.get('/', getAllBooks);

// New Route (Search books from Open Library)
router.get('/search', fetchBooksFromOpenLibrary);


module.exports = router;