import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/NotificationSettings.css';

// Configure axios base URL for API calls
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const NotificationSettings = () => {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const notificationTypes = {
    new_book_release: {
      title: 'New Book Releases',
      description: 'Get notified when your favorite authors release new books'
    },
    reading_goal_reminder: {
      title: 'Reading Goal Reminders',
      description: 'Reminders to help you stay on track with your reading goals'
    },
    friend_activity: {
      title: 'Friend Activity',
      description: 'Updates when your friends review books or join discussions'
    },
    book_club_discussion: {
      title: 'Book Club Discussions',
      description: 'New messages and updates in your book clubs'
    },
    review_request: {
      title: 'Review Requests',
      description: 'When someone requests a review for a book'
    },
    review_received: {
      title: 'Review Responses',
      description: 'When someone reviews a book you requested'
    },
    follow_notification: {
      title: 'New Followers',
      description: 'When someone starts following you'
    },
    book_recommendation: {
      title: 'Book Recommendations',
      description: 'Personalized book suggestions based on your reading history'
    },
    reading_streak: {
      title: 'Reading Streaks',
      description: 'Celebrate your reading achievements and milestones'
    }
  };

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(${API_BASE_URL}/api/notifications/preferences, {
        headers: { Authorization: Bearer ${token} }
      });
      setPreferences(response.data);
    } catch (error) {
      console.error('Error fetching preferences:', error);
      toast.error('Failed to load notification preferences');
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (newPreferences) => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(${API_BASE_URL}/api/notifications/preferences, newPreferences, {
        headers: { Authorization: Bearer ${token} }
      });
      setPreferences(prev => ({ ...prev, ...newPreferences }));
      toast.success('Notification preferences updated successfully');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update notification preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (type, channel) => {
    const newPreferences = {
      ...preferences.preferences,
      [type]: {
        ...preferences.preferences[type],
        [channel]: !preferences.preferences[type][channel]
      }
    };

    updatePreferences({ preferences: newPreferences });
  };

  const handleQuietHoursToggle = () => {
    const newQuietHours = {
      ...preferences.quietHours,
      enabled: !preferences.quietHours.enabled
    };

    updatePreferences({ quietHours: newQuietHours });
  };

  const handleQuietHoursChange = (field, value) => {
    const newQuietHours = {
      ...preferences.quietHours,
      [field]: value
    };

    updatePreferences({ quietHours: newQuietHours });
  };

  const testNotification = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(${API_BASE_URL}/api/notifications/test, {
        type: 'book_recommendation',
        title: 'Test Notification',
        message: 'This is a test notification to verify your settings are working!'
      }, {
        headers: { Authorization: Bearer ${token} }
      });
      toast.success('Test notification sent!');
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast.error('Failed to send test notification');
    }
  };

  if (loading) {
    return (
      <div className="notification-settings loading">
        <div className="loading-spinner"></div>
        <p>Loading notification settings...</p>
      </div>
    );
  }

  if (!preferences) {
    return (
      <div className="notification-settings error">
        <p>Failed to load notification settings. Please try again.</p>
        <button onClick={fetchPreferences} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="notification-settings">
      <div className="settings-header">
        <h2>Notification Settings</h2>
        <p>Customize how and when you receive notifications from BookHive</p>
      </div>

      <div className="settings-section">
        <h3>Notification Types</h3>
        <p className="section-description">
          Choose which types of notifications you want to receive
        </p>

        <div className="notification-types">
          {Object.entries(notificationTypes).map(([type, info]) => (
            <div key={type} className="notification-type">
              <div className="type-info">
                <h4>{info.title}</h4>
                <p>{info.description}</p>
              </div>
              
              <div className="type-controls">
                <div className="control-group">
                  <label className="toggle-label">
                    <input
                      type="checkbox"
                      checked={preferences.preferences[type]?.enabled || false}
                      onChange={() => handleToggle(type, 'enabled')}
                      disabled={saving}
                    />
                    <span className="toggle-slider"></span>
                    <span className="toggle-text">Enable</span>
                  </label>
                </div>

                {preferences.preferences[type]?.enabled && (
                  <div className="channel-controls">
                    <label className="channel-label">
                      <input
                        type="checkbox"
                        checked={preferences.preferences[type]?.push || false}
                        onChange={() => handleToggle(type, 'push')}
                        disabled={saving}
                      />
                      <span>In-app</span>
                    </label>
                    
                    <label className="channel-label">
                      <input
                        type="checkbox"
                        checked={preferences.preferences[type]?.email || false}
                        onChange={() => handleToggle(type, 'email')}
                        disabled={saving}
                      />
                      <span>Email</span>
                    </label>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="settings-section">
        <h3>Quiet Hours</h3>
        <p className="section-description">
          Set times when you don't want to receive notifications
        </p>

        <div className="quiet-hours">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={preferences.quietHours?.enabled || false}
              onChange={handleQuietHoursToggle}
              disabled={saving}
            />
            <span className="toggle-slider"></span>
            <span className="toggle-text">Enable quiet hours</span>
          </label>

          {preferences.quietHours?.enabled && (
            <div className="quiet-hours-times">
              <div className="time-input">
                <label>From:</label>
                <input
                  type="time"
                  value={preferences.quietHours.startTime || '22:00'}
                  onChange={(e) => handleQuietHoursChange('startTime', e.target.value)}
                  disabled={saving}
                />
              </div>
              <div className="time-input">
                <label>To:</label>
                <input
                  type="time"
                  value={preferences.quietHours.endTime || '08:00'}
                  onChange={(e) => handleQuietHoursChange('endTime', e.target.value)}
                  disabled={saving}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="settings-section">
        <h3>Test Notifications</h3>
        <p className="section-description">
          Send a test notification to verify your settings
        </p>
        
        <button 
          onClick={testNotification}
          className="test-btn"
          disabled={saving}
        >
          Send Test Notification
        </button>
      </div>

      {saving && (
        <div className="saving-indicator">
          <div className="saving-spinner"></div>
          <span>Saving changes...</span>
        </div>
      )}
    </div>
  );
};

export default NotificationSettings;