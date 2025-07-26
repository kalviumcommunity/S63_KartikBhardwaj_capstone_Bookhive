const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  bookId: {
    type: String,
    required: true
  },
  bookTitle: {
    type: String,
    default: 'Unknown Title'
  },
  bookAuthor: {
    type: String,
    default: 'Unknown Author'
  },
  bookCover: {
    type: String,
    default: ''
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  review: {
    type: String,
    required: true
  },
  // Keep comment for backward compatibility
  comment: {
    type: String
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index to ensure one review per user per book
reviewSchema.index({ bookId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema); 