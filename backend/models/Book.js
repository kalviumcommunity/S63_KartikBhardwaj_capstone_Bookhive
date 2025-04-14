const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true }, 
    publishYear: { type: Number },            
    coverImage: { type: String },
    openLibraryId: { type: String, unique: true },
    userId: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  { timestamps: true } 
);
const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
