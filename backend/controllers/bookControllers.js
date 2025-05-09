const axios = require('axios');
const Book = require('../models/Book');

// 1. Fetch all books from MongoDB
const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching books', error: error.message });
  }
};



// 2. Fetch books from Open Library API
const fetchBooksFromOpenLibrary = async (req, res) => {
  try {
    const searchQuery = req.query.q;
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

// 3. Save a book to MongoDB
const addBook = async (req, res) => {
  try {
    const { title, author, publishYear, coverImage, openLibraryId } = req.body;

    // Check if the book already exists
    const existingBook = await Book.findOne({ openLibraryId });

    if (existingBook) {
      return res.status(400).json({ message: 'Book already exists in database' });
    }

    const newBook = new Book({
      title,
      author,
      publishYear,
      coverImage,
      openLibraryId
    });

    await newBook.save();
    res.status(201).json({ message: 'Book saved successfully', book: newBook });
  } catch (error) {
    res.status(500).json({ message: 'Error saving book', error: error.message });
  }
};

// 4. Update a book in MongoDB
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, publishYear, coverImage } = req.body;

    const updatedBook = await Book.findByIdAndUpdate(
      id,
      { title, author, publishYear, coverImage },
      { new: true } // Return updated document
    );

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json({ message: 'Book updated successfully', book: updatedBook });
  } catch (error) {
    res.status(500).json({ message: 'Error updating book', error: error.message });
  }
};

// Export
module.exports = { 
  getAllBooks,
  fetchBooksFromOpenLibrary,
  addBook,
  updateBook // 👈 yeh naya export hua
};
