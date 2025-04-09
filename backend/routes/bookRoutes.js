const express = require('express');
const router = express.Router();
const { getAllBooks, createBook, updateBook } = require('../controllers/bookControllers'); 
// GET route - all books
router.get('/', getAllBooks);
// POST route - create book
router.post('/', createBook);
// PUT route - update book
router.put('/:id', updateBook); 
module.exports = router;
