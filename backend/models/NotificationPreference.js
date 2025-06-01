const mongoose = require('mongoose');

const notificationPreferenceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  preferences: {
    new_book_release: {
      enabled: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    reading_goal_reminder: {
      enabled: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    friend_activity: {
      enabled: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    book_club_discussion: {
      enabled: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    review_request: {
      enabled: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    review_received: {
      enabled: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    follow_notification: {
      enabled: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    book_recommendation: {
      enabled: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    },
    reading_streak: {
      enabled: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
      push: { type: Boolean, default: true }
    }
  },
  quietHours: {
    enabled: { type: Boolean, default: false },
    startTime: { type: String, default: '22:00' }, // 10 PM
    endTime: { type: String, default: '08:00' }    // 8 AM
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

notificationPreferenceSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('NotificationPreference', notificationPreferenceSchema);