const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const notificationService = require('../services/notificationService');

// GET: Get user's notifications
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const unreadOnly = req.query.unreadOnly === 'true';

    const result = await notificationService.getUserNotifications(userId, page, limit, unreadOnly);
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

// GET: Get unread notification count
router.get('/unread-count', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const result = await notificationService.getUserNotifications(userId, 1, 1, true);
    
    res.json({ unreadCount: result.unreadCount });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    res.status(500).json({ message: 'Error fetching unread count' });
  }
});

// PUT: Mark notification as read
router.put('/:notificationId/read', auth, async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user._id;

    const notification = await notificationService.markAsRead(notificationId, userId);
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json({ message: 'Notification marked as read', notification });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Error marking notification as read' });
  }
});

// PUT: Mark all notifications as read
router.put('/mark-all-read', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    await notificationService.markAllAsRead(userId);
    
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Error marking all notifications as read' });
  }
});

// DELETE: Delete notification
router.delete('/:notificationId', auth, async (req, res) => {
  try {
    const { notificationId } = req.params;
    const userId = req.user._id;

    await notificationService.deleteNotification(notificationId, userId);
    
    res.json({ message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ message: 'Error deleting notification' });
  }
});

// GET: Get user's notification preferences
router.get('/preferences', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const preferences = await notificationService.getUserPreferences(userId);
    
    res.json(preferences);
  } catch (error) {
    console.error('Error fetching notification preferences:', error);
    res.status(500).json({ message: 'Error fetching notification preferences' });
  }
});

// PUT: Update user's notification preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { preferences, quietHours, timezone } = req.body;

    const updatedPreferences = await notificationService.updateUserPreferences(userId, {
      preferences,
      quietHours,
      timezone
    });
    
    res.json({ message: 'Notification preferences updated', preferences: updatedPreferences });
  } catch (error) {
    console.error('Error updating notification preferences:', error);
    res.status(500).json({ message: 'Error updating notification preferences' });
  }
});

// POST: Test notification (for development)
router.post('/test', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { type, title, message } = req.body;

    const notification = await notificationService.createNotification(
      userId,
      type || 'book_recommendation',
      title || 'Test Notification',
      message || 'This is a test notification from BookHive!',
      { test: true },
      '/books',
      'low'
    );
    
    res.json({ message: 'Test notification created', notification });
  } catch (error) {
    console.error('Error creating test notification:', error);
    res.status(500).json({ message: 'Error creating test notification' });
  }
});

module.exports = router;