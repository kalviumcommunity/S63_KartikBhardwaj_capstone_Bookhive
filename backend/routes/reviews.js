const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Review = require('../models/Review');
const User = require('../models/User');

// GET: Get reviews for a specific book by title
router.get('/book/:bookTitle', async (req, res) => {
  try {
    const { bookTitle } = req.params;
    console.log('Fetching reviews for book:', bookTitle);
    
    const reviews = await Review.find({ bookTitle })
      .populate('userId', 'username avatar')
      .sort({ createdAt: -1 });
    
    // Transform reviews to include user info
    const transformedReviews = reviews.map(review => ({
      id: review._id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      userId: review.userId._id,
      username: review.userId.username,
      userAvatar: review.userId.avatar
    }));
    
    res.json(transformedReviews);
  } catch (error) {
    console.error('Error fetching book reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

// POST: Create a new review
router.post('/', auth, async (req, res) => {
  try {
    const { bookId, bookTitle, rating, comment, bookAuthor, bookCover } = req.body;
    
    console.log('Creating review:', { bookId, bookTitle, rating, comment, userId: req.user._id });
    
    if (!bookTitle || !rating || !comment) {
      return res.status(400).json({ message: 'Book title, rating and comment are required' });
    }
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    // Check if user already reviewed this book (check by bookId if available, otherwise by bookTitle)
    const existingReviewQuery = bookId 
      ? { bookId: bookId, userId: req.user._id }
      : { bookTitle: bookTitle, userId: req.user._id };
    
    const existingReview = await Review.findOne(existingReviewQuery);
    
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }
    
    const newReview = new Review({
      bookId: bookId || `title-${bookTitle.replace(/\s+/g, '-').toLowerCase()}`,
      bookTitle,
      bookAuthor: bookAuthor || 'Unknown Author',
      bookCover: bookCover || '',
      rating: parseInt(rating),
      comment: comment.trim(),
      review: comment.trim(), // Store in both fields for compatibility
      userId: req.user._id
    });
    
    const savedReview = await newReview.save();
    
    // Populate user data for response
    const populatedReview = await Review.findById(savedReview._id)
      .populate('userId', 'username avatar');
    
    const responseReview = {
      id: populatedReview._id,
      rating: populatedReview.rating,
      comment: populatedReview.comment,
      createdAt: populatedReview.createdAt,
      userId: populatedReview.userId._id,
      username: populatedReview.userId.username,
      userAvatar: populatedReview.userId.avatar
    };
    
    res.status(201).json(responseReview);
  } catch (error) {
    console.error('Error creating review:', error);
    if (error.code === 11000) {
      // Duplicate key error
      res.status(400).json({ message: 'You have already reviewed this book' });
    } else {
      res.status(500).json({ message: 'Error creating review' });
    }
  }
});

// GET: Get user's reviews
router.get('/user', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

// PUT: Update a review
router.put('/:reviewId', auth, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if user owns this review
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }
    
    if (rating) review.rating = parseInt(rating);
    if (comment) review.comment = comment.trim();
    
    const updatedReview = await review.save();
    res.json(updatedReview);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Error updating review' });
  }
});

// DELETE: Delete a review
router.delete('/:reviewId', auth, async (req, res) => {
  try {
    const { reviewId } = req.params;
    
    const review = await Review.findById(reviewId);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    // Check if user owns this review
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }
    
    await review.deleteOne();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Error deleting review' });
  }
});

module.exports = router;