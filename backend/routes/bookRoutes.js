const express = require('express');
const router = express.Router();
const { getAllBooks } = require('../controllers/bookControllers');


router.get('/', getAllBooks);

module.exports = router;
