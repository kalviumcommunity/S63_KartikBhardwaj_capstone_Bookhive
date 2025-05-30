const mongoose = require('mongoose');

const reviewRequestSchema = new mongoose.Schema({
  bookId: {
    type: String,
    required: true
  },
  bookTitle: {
    type: String,
    required: true
  },
  bookAuthor: {
    type: String,
    required: true
  },
  coverUrl: {
    type: String,
    default: 'https://via.placeholder.com/200x300?text=No+Cover'
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fulfilledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  fulfilled: {
    type: Boolean,
    default: false
  },
  fulfilledAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ReviewRequest', reviewRequestSchema);