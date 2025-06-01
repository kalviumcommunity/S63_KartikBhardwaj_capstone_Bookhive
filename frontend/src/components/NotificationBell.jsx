import React, { useState, useEffect, useRef } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { BellIcon as BellSolidIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/NotificationBell.css';

// Configure axios base URL for API calls
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(${API_BASE_URL}/api/notifications/unread-count, {
        headers: { Authorization: Bearer ${token} }
      });
      setUnreadCount(response.data.unreadCount);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const fetchNotifications = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(${API_BASE_URL}/api/notifications?limit=10, {
        headers: { Authorization: Bearer ${token} }
      });
      setNotifications(response.data.notifications || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(${API_BASE_URL}/api/notifications/${notificationId}/read, {}, {
        headers: { Authorization: Bearer ${token} }
      });
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(${API_BASE_URL}/api/notifications/mark-all-read, {}, {
        headers: { Authorization: Bearer ${token} }
      });
      
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleBellClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen && (!notifications || notifications.length === 0)) {
      fetchNotifications();
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
    setIsOpen(false);
  };

  const getNotificationIcon = (type) => {
    const icons = {
      'new_book_release': '📚',
      'reading_goal_reminder': '🎯',
      'friend_activity': '👥',
      'book_club_discussion': '💬',
      'review_request': '📝',
      'review_received': '⭐',
      'follow_notification': '👤',
      'book_recommendation': '💡',
      'reading_streak': '🔥'
    };
    return icons[type] || '📢';
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInMinutes = Math.floor((now - notificationDate) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return ${diffInMinutes}m ago;
    if (diffInMinutes < 1440) return ${Math.floor(diffInMinutes / 60)}h ago;
    return ${Math.floor(diffInMinutes / 1440)}d ago;
  };

  if (!user) return null;

  return (
    <div className="notification-bell" ref={dropdownRef}>
      <button 
        className="notification-button"
        onClick={handleBellClick}
        aria-label={`Notifications ${unreadCount > 0 ? (${unreadCount} unread) : ''}`}
      >
        {unreadCount > 0 ? (
          <BellSolidIcon className="bell-icon active" />
        ) : (
          <BellIcon className="bell-icon" />
        )}
        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button 
                className="mark-all-read-btn"
                onClick={markAllAsRead}
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="notification-list">
            {loading ? (
              <div className="notification-loading">Loading...</div>
            ) : !notifications || notifications.length === 0 ? (
              <div className="no-notifications">
                <span>🔔</span>
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={notification-item ${!notification.isRead ? 'unread' : ''}}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-title">
                      {notification.title}
                    </div>
                    <div className="notification-message">
                      {notification.message}
                    </div>
                    <div className="notification-time">
                      {formatTimeAgo(notification.createdAt)}
                    </div>
                  </div>
                  {!notification.isRead && (
                    <div className="unread-indicator"></div>
                  )}
                </div>
              ))
            )}
          </div>

          {notifications && notifications.length > 0 && (
            <div className="notification-footer">
              <a href="/notifications" className="view-all-link">
                View all notifications
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;