const notificationService = require('./notificationService');
const User = require('../models/User');
const Review = require('../models/Review');

class ScheduledTasks {
  
  // Send reading goal reminders (run daily)
  async sendReadingGoalReminders() {
    try {
      console.log('Running reading goal reminders...');
      
      const users = await User.find({});
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();
      
      for (const user of users) {
        try {
          // Get user's reviews for current month
          const monthStart = new Date(currentYear, currentMonth, 1);
          const monthEnd = new Date(currentYear, currentMonth + 1, 0);
          
          const monthlyReviews = await Review.countDocuments({
            userId: user._id,
            createdAt: { $gte: monthStart, $lte: monthEnd }
          });
          
          // Simple goal: encourage reading if less than 2 books this month
          if (monthlyReviews < 2) {
            const goalData = {
              booksRead: monthlyReviews,
              target: 2,
              period: 'monthly'
            };
            
            await notificationService.notifyReadingGoalReminder(user._id, goalData);
          }
          
          // Check for reading streaks
          const lastWeekReviews = await Review.countDocuments({
            userId: user._id,
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
          });
          
          if (lastWeekReviews >= 3) {
            await notificationService.notifyReadingStreak(user._id, {
              days: 7,
              booksRead: lastWeekReviews
            });
          }
          
        } catch (userError) {
          console.error(Error processing reminders for user ${user._id}:, userError);
        }
      }
      
      console.log('Reading goal reminders completed');
    } catch (error) {
      console.error('Error sending reading goal reminders:', error);
    }
  }
  
  // Send book recommendations (run weekly)
  async sendBookRecommendations() {
    try {
      console.log('Running book recommendations...');
      
      const users = await User.find({});
      
      for (const user of users) {
        try {
          // Get user's recent reviews to understand preferences
          const recentReviews = await Review.find({ userId: user._id })
            .sort({ createdAt: -1 })
            .limit(5);
          
          if (recentReviews.length > 0) {
            // Simple recommendation: suggest exploring new genres
            const bookData = {
              id: 'recommendation',
              title: 'Discover New Books'
            };
            
            const reason = 'based on your recent reading activity';
            
            await notificationService.notifyBookRecommendation(user._id, bookData, reason);
          }
          
        } catch (userError) {
          console.error(Error processing recommendations for user ${user._id}:, userError);
        }
      }
      
      console.log('Book recommendations completed');
    } catch (error) {
      console.error('Error sending book recommendations:', error);
    }
  }
  
  // Clean up old notifications (run daily)
  async cleanupOldNotifications() {
    try {
      console.log('Cleaning up old notifications...');
      await notificationService.cleanupOldNotifications();
      console.log('Notification cleanup completed');
    } catch (error) {
      console.error('Error cleaning up notifications:', error);
    }
  }
  
  // Initialize all scheduled tasks
  initializeScheduledTasks() {
    // Run reading goal reminders daily at 9 AM
    setInterval(() => {
      const now = new Date();
      if (now.getHours() === 9 && now.getMinutes() === 0) {
        this.sendReadingGoalReminders();
      }
    }, 60000); // Check every minute
    
    // Run book recommendations weekly on Sundays at 10 AM
    setInterval(() => {
      const now = new Date();
      if (now.getDay() === 0 && now.getHours() === 10 && now.getMinutes() === 0) {
        this.sendBookRecommendations();
      }
    }, 60000); // Check every minute
    
    // Run cleanup daily at midnight
    setInterval(() => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        this.cleanupOldNotifications();
      }
    }, 60000); // Check every minute
    
    console.log('Scheduled tasks initialized');
  }
  
  // For testing purposes - trigger tasks manually
  async runTestTasks() {
    console.log('Running test tasks...');
    await this.sendReadingGoalReminders();
    await this.sendBookRecommendations();
    await this.cleanupOldNotifications();
    console.log('Test tasks completed');
  }
}

module.exports = new ScheduledTasks();