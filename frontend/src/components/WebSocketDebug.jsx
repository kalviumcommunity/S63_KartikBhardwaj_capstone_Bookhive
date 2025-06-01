import React from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';

const WebSocketDebug = () => {
  const { isConnected, notifications, unreadCount, onlineUsers } = useSocket();
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black bg-opacity-75 text-white p-3 rounded-lg text-xs max-w-xs z-50">
      <div className="font-bold mb-2">WebSocket Debug</div>
      <div>Status: <span className={isConnected ? 'text-green-400' : 'text-red-400'}>
        {isConnected ? 'Connected' : 'Disconnected'}
      </span></div>
      <div>User: {user?.username || 'Unknown'}</div>
      <div>Notifications: {notifications.length}</div>
      <div>Unread: {unreadCount}</div>
      <div>Online Users: {onlineUsers.length}</div>
    </div>
  );
};

export default WebSocketDebug;