const mongoose = require('mongoose');
const Review = require('./models/Review');
const axios = require('axios');

// Load environment variables
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bookhive', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function migrateReviews() {
  try {
    console.log('Starting review migration...');
    
    // Find reviews that don't have bookTitle or have empty bookTitle
    const reviewsToMigrate = await Review.find({
      $or: [
        { bookTitle: { $exists: false } },
        { bookTitle: '' },
        { bookTitle: 'Unknown Title' }
      ]
    });

    console.log(`Found ${reviewsToMigrate.length} reviews to migrate`);

    for (let i = 0; i < reviewsToMigrate.length; i++) {
      const review = reviewsToMigrate[i];
      console.log(`Migrating review ${i + 1}/${reviewsToMigrate.length} - ID: ${review._id}`);

      if (review.bookId) {
        try {
          const bookKey = review.bookId.startsWith('/') ? review.bookId.slice(1) : review.bookId;
          const bookResponse = await axios.get(`https://openlibrary.org/works/${bookKey}.json`);
          
          let bookAuthor = 'Unknown Author';
          if (bookResponse.data.authors && bookResponse.data.authors.length > 0) {
            try {
              const authorKey = bookResponse.data.authors[0].author.key;
              const authorResponse = await axios.get(`https://openlibrary.org${authorKey}.json`);
              bookAuthor = authorResponse.data.name || bookAuthor;
            } catch (authorError) {
              console.error('Error fetching author details:', authorError);
            }
          }

          let bookCover = '';
          if (bookResponse.data.covers && bookResponse.data.covers.length > 0) {
            bookCover = `https://covers.openlibrary.org/b/id/${bookResponse.data.covers[0]}-M.jpg`;
          }

          // Update the review
          await Review.findByIdAndUpdate(review._id, {
            bookTitle: bookResponse.data.title || 'Unknown Title',
            bookAuthor: bookAuthor,
            bookCover: bookCover,
            // Migrate comment to review field if review field is empty
            ...((!review.review && review.comment) && { review: review.comment })
          });

          console.log(`✓ Updated review for book: ${bookResponse.data.title}`);
        } catch (error) {
          console.error(`✗ Error updating review ${review._id}:`, error.message);
          // Set default values if API call fails
          await Review.findByIdAndUpdate(review._id, {
            bookTitle: 'Unknown Title',
            bookAuthor: 'Unknown Author',
            bookCover: '',
            ...((!review.review && review.comment) && { review: review.comment })
          });
        }
      } else {
        // If no bookId, set default values
        await Review.findByIdAndUpdate(review._id, {
          bookTitle: 'Unknown Title',
          bookAuthor: 'Unknown Author',
          bookCover: '',
          ...((!review.review && review.comment) && { review: review.comment })
        });
        console.log(`✓ Set default values for review ${review._id}`);
      }

      // Add a small delay to avoid overwhelming the API
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

migrateReviews();