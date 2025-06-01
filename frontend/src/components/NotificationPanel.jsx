import React, { useState, useRef, useEffect } from 'react';
import { useSocket } from '../context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/NotificationPanel.css';
import { 
  BellIcon, 
  XMarkIcon,
  BookOpenIcon,
  UserPlusIcon,
  ChatBubbleLeftIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { BellIcon as BellSolidIcon } from '@heroicons/react/24/solid';

const NotificationPanel = () => {
  const { notifications, unreadCount, markNotificationsAsRead, isConnected } = useSocket();
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_review':
        return <BookOpenIcon className="w-5 h-5 text-blue-500" />;
      case 'new_follow':
        return <UserPlusIcon className="w-5 h-5 text-green-500" />;
      case 'review_comment':
        return <ChatBubbleLeftIcon className="w-5 h-5 text-purple-500" />;
      case 'book_recommendation':
        return <HeartIcon className="w-5 h-5 text-red-500" />;
      default:
        return <BellIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInSeconds = Math.floor((now - notificationDate) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const handleNotificationClick = (notification) => {
    // Mark as read
    if (!notification.read) {
      markNotificationsAsRead([notification._id]);
    }

    // Navigate based on notification type
    switch (notification.type) {
      case 'new_review':
        if (notification.data.bookId) {
          window.location.href = `/book/${notification.data.bookId}`;
        }
        break;
      case 'new_follow':
        window.location.href = '/profile';
        break;
      case 'book_recommendation':
        if (notification.data.bookId) {
          window.location.href = `/book/${notification.data.bookId}`;
        }
        break;
      default:
        console.log('Unknown notification type:', notification.type);
    }
  };

  const markAllAsRead = () => {
    const unreadIds = notifications.filter(n => !n.read).map(n => n._id);
    if (unreadIds.length > 0) {
      markNotificationsAsRead(unreadIds);
    }
  };

  return (
    <div className="notification-panel" ref={panelRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="notification-bell-button"
        title="Notifications"
      >
        {unreadCount > 0 ? (
          <BellSolidIcon className="w-6 h-6 text-blue-600" />
        ) : (
          <BellIcon className="w-6 h-6" />
        )}
        
        {/* Unread Count Badge */}
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ 
              scale: 1,
              transition: { type: "spring", stiffness: 500, damping: 30 }
            }}
            className="notification-badge"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}

        {/* Connection Status Indicator */}
        <div className={`notification-status-indicator ${
          isConnected ? 'connected' : 'disconnected'
        }`} />
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            transition={{ 
              duration: 0.3, 
              ease: [0.4, 0, 0.2, 1],
              type: "spring",
              stiffness: 300,
              damping: 30
            }}
            className="notification-dropdown"
          >
            {/* Header */}
            <div className="notification-header">
              <h3>Notifications</h3>
              <div className="notification-header-actions">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="mark-all-read-btn"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="close-btn"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Connection Status */}
            <div className={`connection-status ${
              isConnected ? 'connected' : 'disconnected'
            }`}>
              <div className={`connection-status-dot ${
                isConnected ? 'connected' : 'disconnected'
              }`} />
              <span>
                {isConnected ? 'Real-time updates active' : 'Connection lost - trying to reconnect...'}
              </span>
            </div>

            {/* Notifications List */}
            <div className="notifications-list">
              {notifications.length === 0 ? (
                <div className="empty-notifications">
                  <BellIcon className="empty-notifications-icon" />
                  <p>No notifications yet</p>
                  <p>You'll see updates here when they arrive</p>
                </div>
              ) : (
                <div>
                  {notifications.map((notification, index) => (
                    <motion.div
                      key={notification._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: index * 0.05,
                        ease: "easeOut"
                      }}
                      whileHover={{ 
                        backgroundColor: "#f9fafb",
                        transition: { duration: 0.2 }
                      }}
                      className={`notification-item ${
                        !notification.read ? 'unread' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="notification-icon">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="notification-content">
                        <p className="notification-title">
                          {notification.title}
                        </p>
                        <p className="notification-message">
                          {notification.message}
                        </p>
                        <div className="notification-footer-info">
                          <p className="notification-time">
                            {formatTimeAgo(notification.createdAt)}
                          </p>
                          {!notification.read && (
                            <div className="notification-unread-dot" />
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="notification-footer">
                <button
                  onClick={() => {
                    setIsOpen(false);
                    window.location.href = '/notifications'; // You can create a dedicated notifications page
                  }}
                  className="view-all-btn"
                >
                  View all notifications
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationPanel;