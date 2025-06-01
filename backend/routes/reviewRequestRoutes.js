const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ReviewRequest = require('../models/ReviewRequest');
const notificationService = require('../services/notificationService');
const User = require('../models/User');

// GET: Get all review requests
router.get('/', async (req, res) => {
  try {
    const requests = await ReviewRequest.find({ fulfilled: false })
      .populate('requestedBy', 'username')
      .sort({ createdAt: -1 });
    
    res.json(requests);
  } catch (error) {
    console.error('Error fetching review requests:', error);
    res.status(500).json({ message: 'Error fetching review requests' });
  }
});

// GET: Get a specific review request
router.get('/:id', async (req, res) => {
  try {
    const request = await ReviewRequest.findById(req.params.id)
      .populate('requestedBy', 'username');
    
    if (!request) {
      return res.status(404).json({ message: 'Review request not found' });
    }
    
    res.json(request);
  } catch (error) {
    console.error('Error fetching review request:', error);
    res.status(500).json({ message: 'Error fetching review request' });
  }
});

// POST: Create a new review request
router.post('/', auth, async (req, res) => {
  try {
    const { bookId, bookTitle, bookAuthor, coverUrl } = req.body;
    
    if (!bookId || !bookTitle || !bookAuthor) {
      return res.status(400).json({ message: 'Book ID, title, and author are required' });
    }
    
    const newRequest = new ReviewRequest({
      bookId,
      bookTitle,
      bookAuthor,
      coverUrl: coverUrl || 'https://via.placeholder.com/200x300?text=No+Cover',
      requestedBy: req.user._id
    });
    
    await newRequest.save();
    
    // Send notifications to all users about the new review request
    try {
      const allUsers = await User.find({ _id: { $ne: req.user._id } }); // Exclude the requester
      
      for (const user of allUsers) {
        await notificationService.notifyReviewRequest(user._id, {
          bookId,
          bookTitle,
          requestId: newRequest._id
        });
      }
    } catch (notificationError) {
      console.error('Error sending review request notifications:', notificationError);
      // Don't fail the request creation if notification fails
    }
    
    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Error creating review request:', error);
    res.status(500).json({ message: 'Error creating review request' });
  }
});

// PUT: Mark a review request as fulfilled
router.put('/:id/fulfill', auth, async (req, res) => {
  try {
    const request = await ReviewRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Review request not found' });
    }
    
    if (request.fulfilled) {
      return res.status(400).json({ message: 'This request has already been fulfilled' });
    }
    
    request.fulfilled = true;
    request.fulfilledBy = req.user._id;
    request.fulfilledAt = Date.now();
    
    await request.save();
    
    res.json({ message: 'Review request fulfilled successfully' });
  } catch (error) {
    console.error('Error fulfilling review request:', error);
    res.status(500).json({ message: 'Error fulfilling review request' });
  }
});

// DELETE: Delete a review request
router.delete('/:id', auth, async (req, res) => {
  try {
    const request = await ReviewRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: 'Review request not found' });
    }
    
    // Only allow the user who created the request to delete it
    if (request.requestedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this request' });
    }
    
    await request.deleteOne();
    
    res.json({ message: 'Review request deleted successfully' });
  } catch (error) {
    console.error('Error deleting review request:', error);
    res.status(500).json({ message: 'Error deleting review request' });
  }
});

module.exports = router;