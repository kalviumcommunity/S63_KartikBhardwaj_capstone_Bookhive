const socketService = require('./socketService');
const Notification = require('../models/Notification');
const User = require('../models/User');

class NotificationService {
  
  // Create a new review notification
  async createNewReviewNotification(reviewData) {
    try {
      const { bookId, bookTitle, reviewerId, reviewerName, rating } = reviewData;
      
      // Find all users who might be interested (you can customize this logic)
      // For now, we'll notify users who have reviewed this book before
      const existingReviews = await require('../models/Review').find({ 
        bookId, 
        userId: { $ne: reviewerId } 
      }).populate('userId', '_id');
      
      const interestedUserIds = existingReviews.map(review => review.userId._id.toString());
      
      if (interestedUserIds.length > 0) {
        const notification = {
          sender: reviewerId,
          type: 'new_review',
          title: 'New Review Posted',
          message: `${reviewerName} posted a ${rating}-star review for "${bookTitle}"`,
          data: {
            bookId,
            bookTitle,
            reviewId: reviewData.reviewId,
            metadata: { rating }
          }
        };

        // Send to all interested users
        const promises = interestedUserIds.map(userId => 
          socketService.sendNotificationToUser(userId, { ...notification, recipient: userId })
        );
        
        await Promise.all(promises);
        console.log(`New review notification sent to ${interestedUserIds.length} users`);
      }
    } catch (error) {
      console.error('Error creating new review notification:', error);
    }
  }

  // Create a new follower notification
  async createNewFollowerNotification(followData) {
    try {
      const { followerId, followedId, followerName } = followData;
      
      const notification = {
        recipient: followedId,
        sender: followerId,
        type: 'new_follow',
        title: 'New Follower',
        message: `${followerName} started following you`,
        data: {
          metadata: { followerName }
        }
      };

      await socketService.sendNotificationToUser(followedId, notification);
      console.log(`New follower notification sent to user ${followedId}`);
    } catch (error) {
      console.error('Error creating new follower notification:', error);
    }
  }

  // Create a book recommendation notification
  async createBookRecommendationNotification(recommendationData) {
    try {
      const { bookId, bookTitle, recommenderId, recommenderName, recipientId, message } = recommendationData;
      
      const notification = {
        recipient: recipientId,
        sender: recommenderId,
        type: 'book_recommendation',
        title: 'Book Recommendation',
        message: `${recommenderName} recommended "${bookTitle}" to you`,
        data: {
          bookId,
          bookTitle,
          metadata: { customMessage: message }
        }
      };

      await socketService.sendNotificationToUser(recipientId, notification);
      console.log(`Book recommendation notification sent to user ${recipientId}`);
    } catch (error) {
      console.error('Error creating book recommendation notification:', error);
    }
  }

  // Create a review comment notification
  async createReviewCommentNotification(commentData) {
    try {
      const { reviewId, reviewOwnerId, commenterId, commenterName, bookTitle } = commentData;
      
      const notification = {
        recipient: reviewOwnerId,
        sender: commenterId,
        type: 'review_comment',
        title: 'New Comment on Your Review',
        message: `${commenterName} commented on your review of "${bookTitle}"`,
        data: {
          reviewId,
          bookTitle,
          metadata: { commenterName }
        }
      };

      await socketService.sendNotificationToUser(reviewOwnerId, notification);
      console.log(`Review comment notification sent to user ${reviewOwnerId}`);
    } catch (error) {
      console.error('Error creating review comment notification:', error);
    }
  }

  // Get notifications for a user
  async getUserNotifications(userId, page = 1, limit = 20) {
    try {
      const skip = (page - 1) * limit;
      
      const notifications = await Notification.find({ recipient: userId })
        .populate('sender', 'username profilePicture')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const totalCount = await Notification.countDocuments({ recipient: userId });
      const unreadCount = await Notification.countDocuments({ recipient: userId, read: false });

      return {
        notifications,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalCount / limit),
          totalCount,
          hasMore: skip + notifications.length < totalCount
        },
        unreadCount
      };
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw error;
    }
  }

  // Mark notifications as read
  async markNotificationsAsRead(userId, notificationIds) {
    try {
      const result = await Notification.updateMany(
        { 
          _id: { $in: notificationIds }, 
          recipient: userId 
        },
        { read: true }
      );

      return result;
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read for a user
  async markAllNotificationsAsRead(userId) {
    try {
      const result = await Notification.updateMany(
        { recipient: userId, read: false },
        { read: true }
      );

      return result;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Delete old notifications (cleanup job)
  async deleteOldNotifications(daysOld = 30) {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysOld);

      const result = await Notification.deleteMany({
        createdAt: { $lt: cutoffDate },
        read: true
      });

      console.log(`Deleted ${result.deletedCount} old notifications`);
      return result;
    } catch (error) {
      console.error('Error deleting old notifications:', error);
      throw error;
    }
  }

  // Get notification statistics
  async getNotificationStats(userId) {
    try {
      const stats = await Notification.aggregate([
        { $match: { recipient: userId } },
        {
          $group: {
            _id: '$type',
            count: { $sum: 1 },
            unreadCount: {
              $sum: { $cond: [{ $eq: ['$read', false] }, 1, 0] }
            }
          }
        }
      ]);

      return stats;
    } catch (error) {
      console.error('Error getting notification stats:', error);
      throw error;
    }
  }
}

module.exports = new NotificationService();