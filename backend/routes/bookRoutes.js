const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { getAllBooks, fetchBooksFromOpenLibrary, addBook, updateBook } = require('../controllers/bookControllers');
const Review = require('../models/Review');
const Book = require('../models/Book');
const axios = require('axios');

// GET: All books from MongoDB
router.get('/', getAllBooks);

// GET: Search books from Open Library
router.get('/search', fetchBooksFromOpenLibrary);

// POST: Add a new book to MongoDB
router.post('/', addBook);








// PUT: Update a book in MongoDB
router.put('/:id', updateBook);

// GET: Get book details with reviews
router.get('/works/:bookId', async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const reviews = await Review.find({ bookId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 });

    const averageRating = reviews.length > 0
      ? reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length
      : 0;

    res.json({
      reviews: reviews.map(review => ({
        _id: review._id,
        text: review.review,
        rating: review.rating,
        userName: review.userId ? review.userId.username : 'Anonymous',
        createdAt: review.createdAt
      })),
      averageRating
    });
  } catch (error) {
    console.error('Error fetching book details:', error);
    res.status(500).json({ message: 'Error fetching book details' });
  }
});

// POST: Add a review to a book
router.post('/works/:bookId/review', auth, async (req, res) => {
  try {
    const { review, rating } = req.body;
    const bookId = req.params.bookId;
    const userId = req.user._id; // Get user ID from auth middleware

    console.log('Adding review:', { bookId, userId, rating, review });

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if user has already reviewed this book
    const existingReview = await Review.findOne({ bookId, userId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }

    const newReview = new Review({
      bookId,
      userId,
      review,
      rating
    });

    await newReview.save();

    // Populate user information
    await newReview.populate('userId', 'username');

    res.status(201).json({
      _id: newReview._id,
      text: newReview.review,
      rating: newReview.rating,
      userName: newReview.userId.username,
      createdAt: newReview.createdAt
    });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Error adding review' });
  }
});

// GET: Get user's reviews
router.get('/reviews/user', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const reviews = await Review.find({ userId })
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

// GET: Get all reviews with book details
router.get('/reviews/all', async (req, res) => {
  try {
    // Fetch reviews and populate user data
    const reviews = await Review.find()
      .populate({
        path: 'userId',
        select: 'username avatar',
        model: 'User'
      })
      .sort({ createdAt: -1 });

    // Filter out reviews with missing user data
    const validReviews = reviews.filter(review => review.userId);

    // Fetch book details for each review
    const reviewsWithDetails = await Promise.all(
      validReviews.map(async (review) => {
        try {
          const bookKey = review.bookId.startsWith('/') ? review.bookId.slice(1) : review.bookId;
          const bookResponse = await axios.get(`https://openlibrary.org/works/${bookKey}.json`);
          
          return {
            ...review.toObject(),
            bookDetails: {
              title: bookResponse.data.title || 'Unknown Title',
              author: bookResponse.data.authors?.[0]?.name || 'Unknown Author',
              cover_i: review.cover_i,
              description: bookResponse.data.description?.value || bookResponse.data.description || 'No description available'
            }
          };
        } catch (error) {
          console.error('Error fetching book details:', error);
          return {
            ...review.toObject(),
            bookDetails: {
              title: 'Book Title Unavailable',
              author: 'Author Unknown',
              cover_i: null,
              description: 'Book details temporarily unavailable'
            }
          };
        }
      })
    );

    res.json(reviewsWithDetails);
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

// Add this new route
router.get('/work/:bookId', async (req, res) => {
  try {
    const { bookId } = req.params;
    const response = await axios.get(`https://openlibrary.org/works/${bookId}.json`);
    
    // Get cover ID
    const coverId = response.data.covers?.[0];
    const coverUrl = coverId 
      ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
      : null;

    const bookDetails = {
      title: response.data.title || 'Unknown Title',
      author: response.data.authors?.[0]?.name || 'Unknown Author',
      coverUrl: coverUrl
    };

    res.json(bookDetails);
  } catch (error) {
    console.error('Error fetching book details:', error);
    res.status(500).json({ 
      message: 'Error fetching book details',
      title: 'Unknown Title',
      author: 'Unknown Author',
      coverUrl: null
    });
  }
});

// Endpoint to fetch external book details
router.get('/external-details', async (req, res) => {
  try {
    const { title } = req.query;
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Clean and encode the search query
    const cleanTitle = title.replace(/\+/g, ' ').replace(/\s+or\s+/g, ' ');
    const searchQuery = encodeURIComponent(cleanTitle);
    
    // First try to get the book details from Open Library
    const searchResponse = await axios.get(`https://openlibrary.org/search.json?title=${searchQuery}&limit=1`);
    
    if (searchResponse.data.docs && searchResponse.data.docs.length > 0) {
      const bookData = searchResponse.data.docs[0];
      
      // Get the work ID if available
      const workId = bookData.key;
      let workData = null;
      
      try {
        if (workId) {
          const workResponse = await axios.get(`https://openlibrary.org${workId}.json`);
          workData = workResponse.data;
        }
      } catch (workError) {
        console.error('Error fetching work details:', workError);
      }

      // Get cover ID and URL
      const coverId = workData?.covers?.[0] || bookData.cover_i;
      const coverUrl = coverId 
        ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
        : null;

      // Get description from work data or first sentence
      const description = workData?.description?.value || 
                         workData?.description || 
                         bookData.first_sentence?.[0] || 
                         'No description available.';

      const details = {
        key: workId,
        title: workData?.title || bookData.title,
        author: bookData.author_name?.[0] || 'Unknown Author',
        coverUrl: coverUrl,
        description: description,
        subjects: workData?.subjects || bookData.subject?.slice(0, 10) || [],
        firstPublishYear: bookData.first_publish_year,
        language: bookData.language?.[0] || 'Unknown',
        publishers: bookData.publisher?.[0] || 'Unknown',
        numberOfPages: bookData.number_of_pages_median || 'Unknown',
        publishDate: bookData.publish_date?.[0] || 'Unknown',
        isbn: bookData.isbn?.[0] || 'Unknown'
      };
      
      res.json(details);
    } else {
      // If no results found, try searching by title words
      const titleWords = cleanTitle.split(' ').filter(word => word.length > 3);
      const alternativeQuery = titleWords.join(' ');
      
      const altSearchResponse = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(alternativeQuery)}&limit=1`);
      
      if (altSearchResponse.data.docs && altSearchResponse.data.docs.length > 0) {
        const bookData = altSearchResponse.data.docs[0];
        
        const details = {
          key: bookData.key,
          title: bookData.title,
          author: bookData.author_name?.[0] || 'Unknown Author',
          coverUrl: bookData.cover_i ? `https://covers.openlibrary.org/b/id/${bookData.cover_i}-L.jpg` : null,
          description: bookData.first_sentence?.[0] || 'No description available.',
          subjects: bookData.subject?.slice(0, 10) || [],
          firstPublishYear: bookData.first_publish_year,
          language: bookData.language?.[0] || 'Unknown',
          publishers: bookData.publisher?.[0] || 'Unknown',
          numberOfPages: bookData.number_of_pages_median || 'Unknown',
          publishDate: bookData.publish_date?.[0] || 'Unknown',
          isbn: bookData.isbn?.[0] || 'Unknown'
        };
        
        res.json(details);
      } else {
        // If still no results, return default data
        res.json({
          key: null,
          title: cleanTitle,
          author: 'Unknown Author',
          coverUrl: null,
          description: 'No description available.',
          subjects: [],
          firstPublishYear: 'Unknown',
          language: 'Unknown',
          publishers: 'Unknown',
          numberOfPages: 'Unknown',
          publishDate: 'Unknown',
          isbn: 'Unknown'
        });
      }
    }
  } catch (error) {
    console.error('Error fetching external book details:', error);
    res.status(500).json({ 
      message: 'Failed to fetch book details',
      details: {
        key: null,
        title: req.query.title || 'Unknown',
        author: 'Unknown Author',
        coverUrl: null,
        description: 'No description available.',
        subjects: [],
        firstPublishYear: 'Unknown',
        language: 'Unknown',
        publishers: 'Unknown',
        numberOfPages: 'Unknown',
        publishDate: 'Unknown',
        isbn: 'Unknown'
      }
    });
  }
});

// PUT: Update a review
router.put('/reviews/:reviewId', auth, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { review, rating } = req.body;
    const userId = req.user._id;

    const existingReview = await Review.findById(reviewId);
    if (!existingReview) {
      return res.status(404).json({ message: 'Review not found' });
    }
    if (existingReview.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    existingReview.review = review;
    existingReview.rating = rating;
    await existingReview.save();

    res.json({
      review: existingReview.review,
      rating: existingReview.rating
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating review' });
  }
});

// DELETE: Delete a review
router.delete('/reviews/:reviewId', auth, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    const existingReview = await Review.findById(reviewId);
    if (!existingReview) {
      return res.status(404).json({ message: 'Review not found' });
    }
    if (existingReview.userId.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await existingReview.deleteOne();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review' });
  }
});

module.exports = router;
