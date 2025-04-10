const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String },
  publishYear: { type: String },
  coverImage: { type: String },
  openLibraryId: { type: String, unique: true }
});

const Book = mongoose.model('Book', bookSchema);


module.exports = Book;