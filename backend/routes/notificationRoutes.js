const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const notificationService = require('../services/notificationService');

// Get user notifications
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const userId = req.user._id;

    const result = await notificationService.getUserNotifications(
      userId, 
      parseInt(page), 
      parseInt(limit)
    );

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications'
    });
  }
});

// Get notification statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const stats = await notificationService.getNotificationStats(userId);

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching notification stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notification statistics'
    });
  }
});

// Mark specific notifications as read
router.put('/mark-read', auth, async (req, res) => {
  try {
    const { notificationIds } = req.body;
    const userId = req.user._id;

    if (!notificationIds || !Array.isArray(notificationIds)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid notification IDs provided'
      });
    }

    const result = await notificationService.markNotificationsAsRead(userId, notificationIds);

    res.json({
      success: true,
      message: 'Notifications marked as read',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error marking notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark notifications as read'
    });
  }
});

// Mark all notifications as read
router.put('/mark-all-read', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await notificationService.markAllNotificationsAsRead(userId);

    res.json({
      success: true,
      message: 'All notifications marked as read',
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read'
    });
  }
});

// Test notification endpoint (for development)
router.post('/test', auth, async (req, res) => {
  try {
    const { type, title, message } = req.body;
    const userId = req.user._id;

    const testNotification = {
      recipient: userId,
      sender: userId,
      type: type || 'new_review',
      title: title || 'Test Notification',
      message: message || 'This is a test notification',
      data: {
        bookId: 'test-book-id',
        bookTitle: 'Test Book',
        metadata: { test: true }
      }
    };

    const socketService = require('../services/socketService');
    await socketService.sendNotificationToUser(userId, testNotification);

    res.json({
      success: true,
      message: 'Test notification sent'
    });
  } catch (error) {
    console.error('Error sending test notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test notification'
    });
  }
});

module.exports = router;