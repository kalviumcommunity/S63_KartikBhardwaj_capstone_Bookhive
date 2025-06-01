const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Notification = require('../models/Notification');

class SocketService {
  constructor() {
    this.io = null;
    this.connectedUsers = new Map(); // userId -> socketId mapping
  }

  initialize(server) {
    const { Server } = require('socket.io');
    
    this.io = new Server(server, {
      cors: {
        origin: [
          'http://localhost:5173',
          'http://localhost:3000',
          'https://hilarious-taiyaki-51d18d.netlify.app',
          'https://bookhiveee.netlify.app'
        ],
        credentials: true,
        methods: ['GET', 'POST']
      }
    });

    // Authentication middleware for Socket.IO
    this.io.use(async (socket, next) => {
      try {
        console.log('🔐 Socket authentication attempt');
        console.log('📋 Handshake auth:', socket.handshake.auth);
        console.log('📋 Headers:', socket.handshake.headers);
        
        const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
          console.log('❌ No token provided in socket handshake');
          return next(new Error('Authentication error: No token provided'));
        }

        console.log('🔑 Token found, verifying...');

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'bookhive_secret_key_2024');
        console.log('✅ Token decoded successfully:', decoded.userId);
        
        const user = await User.findById(decoded.userId).select('-password');

        if (!user) {
          console.log('❌ User not found in database');
          return next(new Error('Authentication error: User not found'));
        }

        console.log('✅ User authenticated:', user.username);
        socket.userId = user._id.toString();
        socket.user = user;
        next();
      } catch (error) {
        console.error('❌ Socket authentication error:', error.message);
        next(new Error(`Authentication error: ${error.message}`));
      }
    });

    this.io.on('connection', (socket) => {
      console.log(`User ${socket.user.username} connected with socket ID: ${socket.id}`);
      
      // Store user connection
      this.connectedUsers.set(socket.userId, socket.id);
      
      // Join user to their personal room for notifications
      socket.join(`user_${socket.userId}`);

      // Handle user going online
      socket.broadcast.emit('user_online', {
        userId: socket.userId,
        username: socket.user.username
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`User ${socket.user.username} disconnected`);
        this.connectedUsers.delete(socket.userId);
        
        // Notify others that user went offline
        socket.broadcast.emit('user_offline', {
          userId: socket.userId,
          username: socket.user.username
        });
      });

      // Handle joining book discussion rooms
      socket.on('join_book_room', (bookId) => {
        socket.join(`book_${bookId}`);
        console.log(`User ${socket.user.username} joined book room: ${bookId}`);
      });

      // Handle leaving book discussion rooms
      socket.on('leave_book_room', (bookId) => {
        socket.leave(`book_${bookId}`);
        console.log(`User ${socket.user.username} left book room: ${bookId}`);
      });

      // Handle marking notifications as read
      socket.on('mark_notifications_read', async (notificationIds) => {
        try {
          await Notification.updateMany(
            { 
              _id: { $in: notificationIds }, 
              recipient: socket.userId 
            },
            { read: true }
          );
          
          socket.emit('notifications_marked_read', { success: true });
        } catch (error) {
          console.error('Error marking notifications as read:', error);
          socket.emit('notifications_marked_read', { success: false, error: error.message });
        }
      });

      // Handle real-time typing indicators for book discussions
      socket.on('typing_start', (data) => {
        socket.to(`book_${data.bookId}`).emit('user_typing', {
          userId: socket.userId,
          username: socket.user.username,
          bookId: data.bookId
        });
      });

      socket.on('typing_stop', (data) => {
        socket.to(`book_${data.bookId}`).emit('user_stopped_typing', {
          userId: socket.userId,
          username: socket.user.username,
          bookId: data.bookId
        });
      });
    });

    console.log('Socket.IO server initialized');
  }

  // Send notification to a specific user
  async sendNotificationToUser(userId, notification) {
    try {
      // Save notification to database
      const savedNotification = await Notification.create(notification);
      
      // Populate sender information
      await savedNotification.populate('sender', 'username profilePicture');
      
      // Send real-time notification if user is online
      this.io.to(`user_${userId}`).emit('new_notification', savedNotification);
      
      console.log(`Notification sent to user ${userId}:`, notification.title);
      return savedNotification;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  }

  // Send notification to multiple users
  async sendNotificationToUsers(userIds, notification) {
    const promises = userIds.map(userId => this.sendNotificationToUser(userId, notification));
    return Promise.all(promises);
  }

  // Broadcast to all users in a book room
  broadcastToBookRoom(bookId, event, data) {
    this.io.to(`book_${bookId}`).emit(event, data);
  }

  // Broadcast to all connected users
  broadcastToAll(event, data) {
    this.io.emit(event, data);
  }

  // Get online users count
  getOnlineUsersCount() {
    return this.connectedUsers.size;
  }

  // Check if user is online
  isUserOnline(userId) {
    return this.connectedUsers.has(userId);
  }

  // Get all online users
  getOnlineUsers() {
    return Array.from(this.connectedUsers.keys());
  }
}

// Export singleton instance
module.exports = new SocketService();