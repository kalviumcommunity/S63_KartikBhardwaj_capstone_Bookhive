const express = require('express');
const router = express.Router();
const { getAllBooks, createBook } = require('../controllers/bookControllers');

// GET route - all books
router.get('/', getAllBooks);

// POST route - create book
router.post('/', createBook);

module.exports = router;
