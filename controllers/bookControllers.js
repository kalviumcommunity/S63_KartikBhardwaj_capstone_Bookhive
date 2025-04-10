const axios = require('axios'); // <-- Yeh add karna zaroori hai
const Book = require('../models/Book'); // Existing Book model import

// 1. Function to fetch all books from your MongoDB
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
};

// 2. Function to fetch books from Open Library API
const fetchBooksFromOpenLibrary = async (req, res) => {
  try {
    const searchQuery = req.query.q; // User kya search kar raha hai
    const response = await axios.get(`https://openlibrary.org/search.json?q=${searchQuery}`);
    
    const books = response.data.docs.map(book => ({
      title: book.title,
      author: book.author_name ? book.author_name.join(', ') : 'Unknown',
      publishYear: book.first_publish_year || 'N/A',
      coverImage: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg` : '',
      openLibraryId: book.key
    }));

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching from Open Library', error: error.message });
  }
};

// Export both functions properly
module.exports = { 
  getAllBooks,
  fetchBooksFromOpenLibrary
};
