const Notification = require('../models/Notification');
const NotificationPreference = require('../models/NotificationPreference');
const User = require('../models/User');
const emailService = require('./emailService');

class NotificationService {
  
  // Create a new notification
  async createNotification(userId, type, title, message, data = {}, actionUrl = null, priority = 'medium') {
    try {
      // Check user's notification preferences
      const preferences = await this.getUserPreferences(userId);
      
      if (!preferences.preferences[type]?.enabled) {
        console.log(Notification type ${type} is disabled for user ${userId});
        return null;
      }

      // Check quiet hours
      if (this.isQuietHours(preferences)) {
        console.log(Quiet hours active for user ${userId}, delaying notification);
        // In a real implementation, you'd queue this for later
      }

      const notification = new Notification({
        userId,
        type,
        title,
        message,
        data,
        actionUrl,
        priority
      });

      await notification.save();

      // Send email if enabled
      if (preferences.preferences[type]?.email) {
        await this.sendEmailNotification(userId, notification);
      }

      // In a real app, you'd also send push notifications here
      // if (preferences.preferences[type]?.push) {
      //   await this.sendPushNotification(userId, notification);
      // }

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Get user's notification preferences
  async getUserPreferences(userId) {
    try {
      let preferences = await NotificationPreference.findOne({ userId });
      
      if (!preferences) {
        // Create default preferences for new user
        preferences = new NotificationPreference({ userId });
        await preferences.save();
      }
      
      return preferences;
    } catch (error) {
      console.error('Error getting user preferences:', error);
      throw error;
    }
  }

  // Update user's notification preferences
  async updateUserPreferences(userId, newPreferences) {
    try {
      const preferences = await NotificationPreference.findOneAndUpdate(
        { userId },
        { preferences: newPreferences, updatedAt: new Date() },
        { new: true, upsert: true }
      );
      
      return preferences;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  }

  // Check if current time is within quiet hours
  isQuietHours(preferences) {
    if (!preferences.quietHours.enabled) return false;
    
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format
    
    const startTime = preferences.quietHours.startTime;
    const endTime = preferences.quietHours.endTime;
    
    // Handle overnight quiet hours (e.g., 22:00 to 08:00)
    if (startTime > endTime) {
      return currentTime >= startTime || currentTime <= endTime;
    } else {
      return currentTime >= startTime && currentTime <= endTime;
    }
  }

  // Send email notification
  async sendEmailNotification(userId, notification) {
    try {
      const user = await User.findById(userId);
      if (!user || !user.email) return;

      const emailContent = {
        to: user.email,
        subject: notification.title,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">${notification.title}</h2>
            <p>${notification.message}</p>
            ${notification.actionUrl ? `
              <a href="${notification.actionUrl}" 
                 style="background-color: #2563eb; color: white; padding: 10px 20px; 
                        text-decoration: none; border-radius: 5px; display: inline-block;">
                View Details
              </a>
            ` : ''}
            <hr style="margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">
              You received this notification from BookHive. 
              <a href="${process.env.FRONTEND_URL}/notifications">Manage your notification preferences</a>
            </p>
          </div>
        `
      };

      await emailService.sendEmail(emailContent);
    } catch (error) {
      console.error('Error sending email notification:', error);
    }
  }

  // Get notifications for a user
  async getUserNotifications(userId, page = 1, limit = 20, unreadOnly = false) {
    try {
      const query = { userId };
      if (unreadOnly) {
        query.isRead = false;
      }

      const notifications = await Notification.find(query)
        .sort({ createdAt: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit);

      const total = await Notification.countDocuments(query);
      const unreadCount = await Notification.countDocuments({ userId, isRead: false });

      return {
        notifications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        unreadCount
      };
    } catch (error) {
      console.error('Error getting user notifications:', error);
      throw error;
    }
  }

  // Mark notification as read
  async markAsRead(notificationId, userId) {
    try {
      const notification = await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { isRead: true },
        { new: true }
      );
      
      return notification;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read for a user
  async markAllAsRead(userId) {
    try {
      await Notification.updateMany(
        { userId, isRead: false },
        { isRead: true }
      );
      
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Delete notification
  async deleteNotification(notificationId, userId) {
    try {
      await Notification.findOneAndDelete({ _id: notificationId, userId });
      return true;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // Specific notification creators
  async notifyNewBookRelease(userId, bookData) {
    return this.createNotification(
      userId,
      'new_book_release',
      'New Book Release!',
      "${bookData.title}" by ${bookData.author} is now available!,
      { bookId: bookData.id, author: bookData.author },
      /book/${bookData.id},
      'medium'
    );
  }

  async notifyReadingGoalReminder(userId, goalData) {
    return this.createNotification(
      userId,
      'reading_goal_reminder',
      'Reading Goal Reminder',
      You're ${goalData.booksRead}/${goalData.target} books into your ${goalData.period} goal. Keep it up!,
      goalData,
      '/profile',
      'low'
    );
  }

  async notifyFriendActivity(userId, friendData, activityType) {
    const messages = {
      'new_review': ${friendData.username} just reviewed "${friendData.bookTitle}",
      'finished_book': ${friendData.username} finished reading "${friendData.bookTitle}",
      'joined': ${friendData.username} joined BookHive!
    };

    return this.createNotification(
      userId,
      'friend_activity',
      'Friend Activity',
      messages[activityType] || ${friendData.username} has new activity,
      { friendId: friendData.id, activityType },
      /user/${friendData.id},
      'low'
    );
  }

  async notifyReviewRequest(userId, requestData) {
    return this.createNotification(
      userId,
      'review_request',
      'Review Request',
      Someone requested a review for "${requestData.bookTitle}",
      { bookId: requestData.bookId, requestId: requestData.requestId },
      /book/${requestData.bookId},
      'medium'
    );
  }

  async notifyReviewReceived(userId, reviewData) {
    return this.createNotification(
      userId,
      'review_received',
      'New Review on Your Request',
      ${reviewData.reviewerName} reviewed "${reviewData.bookTitle}" that you requested!,
      { bookId: reviewData.bookId, reviewId: reviewData.reviewId },
      /book/${reviewData.bookId},
      'medium'
    );
  }

  async notifyNewFollower(userId, followerData) {
    return this.createNotification(
      userId,
      'follow_notification',
      'New Follower',
      ${followerData.username} started following you!,
      { followerId: followerData.id },
      /user/${followerData.id},
      'low'
    );
  }

  async notifyBookRecommendation(userId, bookData, reason) {
    return this.createNotification(
      userId,
      'book_recommendation',
      'Book Recommendation',
      We think you'll love "${bookData.title}" ${reason},
      { bookId: bookData.id, reason },
      /book/${bookData.id},
      'low'
    );
  }

  async notifyReadingStreak(userId, streakData) {
    return this.createNotification(
      userId,
      'reading_streak',
      'Reading Streak!',
      Congratulations! You've maintained a ${streakData.days}-day reading streak!,
      streakData,
      '/profile',
      'medium'
    );
  }

  // Clean up old notifications (run this as a cron job)
  async cleanupOldNotifications() {
    try {
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      await Notification.deleteMany({ createdAt: { $lt: thirtyDaysAgo } });
      console.log('Old notifications cleaned up');
    } catch (error) {
      console.error('Error cleaning up old notifications:', error);
    }
  }
}

module.exports = new NotificationService();