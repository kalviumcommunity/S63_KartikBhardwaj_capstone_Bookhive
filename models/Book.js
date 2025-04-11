const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },  // usually author bhi required hota hai
    publishYear: { type: Number },             // Year should be Number, not String
    coverImage: { type: String },
    openLibraryId: { type: String, unique: true }
  },
  { timestamps: true }  // createdAt aur updatedAt automatic aa jayega
);

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
