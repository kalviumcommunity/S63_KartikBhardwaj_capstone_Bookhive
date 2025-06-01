import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user, isAuthenticated } = useAuth();

  // Get API URL from environment
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

  useEffect(() => {
    if (isAuthenticated() && user) {
      initializeSocket();
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [user, isAuthenticated]);

  const initializeSocket = () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    console.log('Initializing Socket.IO connection...');
    
    const newSocket = io(API_URL, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling']
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('✅ Connected to Socket.IO server');
      setIsConnected(true);
      toast.success('Real-time connection established!', {
        position: 'bottom-right',
        autoClose: 3000
      });
    });

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from Socket.IO server');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      setIsConnected(false);
      toast.error('Failed to establish real-time connection', {
        position: 'bottom-right',
        autoClose: 5000
      });
    });

    // Notification events
    newSocket.on('new_notification', (notification) => {
      console.log('📢 New notification received:', notification);
      
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Show toast notification
      toast.info(notification.message, {
        position: 'top-right',
        autoClose: 5000,
        onClick: () => {
          // Handle notification click (e.g., navigate to relevant page)
          handleNotificationClick(notification);
        }
      });
    });

    // User presence events
    newSocket.on('user_online', (userData) => {
      console.log('👤 User came online:', userData.username);
      setOnlineUsers(prev => [...prev.filter(u => u.userId !== userData.userId), userData]);
    });

    newSocket.on('user_offline', (userData) => {
      console.log('👤 User went offline:', userData.username);
      setOnlineUsers(prev => prev.filter(u => u.userId !== userData.userId));
    });

    // Book discussion events
    newSocket.on('user_typing', (data) => {
      console.log('⌨️ User typing:', data.username, 'in book:', data.bookId);
      // Handle typing indicator
    });

    newSocket.on('user_stopped_typing', (data) => {
      console.log('⌨️ User stopped typing:', data.username, 'in book:', data.bookId);
      // Handle stop typing indicator
    });

    setSocket(newSocket);
  };

  const disconnectSocket = () => {
    if (socket) {
      console.log('🔌 Disconnecting socket...');
      socket.disconnect();
      setSocket(null);
      setIsConnected(false);
      setOnlineUsers([]);
    }
  };

  const handleNotificationClick = (notification) => {
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

  // Socket methods
  const joinBookRoom = (bookId) => {
    if (socket && isConnected) {
      socket.emit('join_book_room', bookId);
      console.log(`📚 Joined book room: ${bookId}`);
    }
  };

  const leaveBookRoom = (bookId) => {
    if (socket && isConnected) {
      socket.emit('leave_book_room', bookId);
      console.log(`📚 Left book room: ${bookId}`);
    }
  };

  const markNotificationsAsRead = (notificationIds) => {
    if (socket && isConnected) {
      socket.emit('mark_notifications_read', notificationIds);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notificationIds.includes(notif._id) 
            ? { ...notif, read: true }
            : notif
        )
      );
      
      // Update unread count
      const unreadToRead = notifications.filter(n => 
        notificationIds.includes(n._id) && !n.read
      ).length;
      setUnreadCount(prev => Math.max(0, prev - unreadToRead));
    }
  };

  const startTyping = (bookId) => {
    if (socket && isConnected) {
      socket.emit('typing_start', { bookId });
    }
  };

  const stopTyping = (bookId) => {
    if (socket && isConnected) {
      socket.emit('typing_stop', { bookId });
    }
  };

  // Fetch initial notifications
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Load notifications when socket connects
  useEffect(() => {
    if (isConnected && user) {
      fetchNotifications();
    }
  }, [isConnected, user]);

  const value = {
    socket,
    isConnected,
    notifications,
    unreadCount,
    onlineUsers,
    joinBookRoom,
    leaveBookRoom,
    markNotificationsAsRead,
    startTyping,
    stopTyping,
    fetchNotifications
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};