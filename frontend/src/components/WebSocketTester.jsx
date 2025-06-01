import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  PlayIcon, 
  StopIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const WebSocketTester = () => {
  const { socket, isConnected, joinBookRoom, leaveBookRoom } = useSocket();
  const { user } = useAuth();
  const [testResults, setTestResults] = useState([]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [currentBookRoom, setCurrentBookRoom] = useState('');

  const addTestResult = (test, status, message) => {
    setTestResults(prev => [...prev, {
      id: Date.now(),
      test,
      status,
      message,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const runConnectionTest = async () => {
    addTestResult('Connection Test', 'running', 'Testing WebSocket connection...');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (isConnected) {
      addTestResult('Connection Test', 'success', 'WebSocket connection is active');
    } else {
      addTestResult('Connection Test', 'error', 'WebSocket connection failed');
    }
  };

  const runNotificationTest = async () => {
    addTestResult('Notification Test', 'running', 'Sending test notification...');
    
    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      
      const response = await fetch(`${API_URL}/api/notifications/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: 'new_review',
          title: 'Test Notification',
          message: 'This is a test notification from WebSocket tester'
        })
      });

      if (response.ok) {
        addTestResult('Notification Test', 'success', 'Test notification sent successfully');
      } else {
        addTestResult('Notification Test', 'error', 'Failed to send test notification');
      }
    } catch (error) {
      addTestResult('Notification Test', 'error', `Error: ${error.message}`);
    }
  };

  const runBookRoomTest = async () => {
    const testBookId = 'test-book-123';
    
    addTestResult('Book Room Test', 'running', 'Testing book room join/leave...');
    
    // Join room
    joinBookRoom(testBookId);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    addTestResult('Book Room Test', 'success', `Joined book room: ${testBookId}`);
    
    // Leave room
    await new Promise(resolve => setTimeout(resolve, 1000));
    leaveBookRoom(testBookId);
    
    addTestResult('Book Room Test', 'success', `Left book room: ${testBookId}`);
  };

  const runAllTests = async () => {
    setIsRunningTests(true);
    setTestResults([]);
    
    await runConnectionTest();
    await runNotificationTest();
    await runBookRoomTest();
    
    setIsRunningTests(false);
    addTestResult('All Tests', 'success', 'All tests completed');
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      case 'running':
        return <ClockIcon className="w-5 h-5 text-yellow-500 animate-spin" />;
      default:
        return null;
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">Please log in to test WebSocket functionality.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            WebSocket Testing Dashboard
          </h2>
          <p className="text-gray-600">
            Test real-time functionality and WebSocket connections
          </p>
          
          {/* Connection Status */}
          <div className={`mt-4 inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
            isConnected 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        {/* Test Controls */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Controls</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={runConnectionTest}
              disabled={isRunningTests}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <PlayIcon className="w-4 h-4" />
              <span>Test Connection</span>
            </button>

            <button
              onClick={runNotificationTest}
              disabled={isRunningTests || !isConnected}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <PlayIcon className="w-4 h-4" />
              <span>Test Notifications</span>
            </button>

            <button
              onClick={runBookRoomTest}
              disabled={isRunningTests || !isConnected}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <PlayIcon className="w-4 h-4" />
              <span>Test Book Rooms</span>
            </button>

            <button
              onClick={runAllTests}
              disabled={isRunningTests}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <PlayIcon className="w-4 h-4" />
              <span>Run All Tests</span>
            </button>
          </div>

          {testResults.length > 0 && (
            <button
              onClick={clearResults}
              className="mt-4 flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <StopIcon className="w-4 h-4" />
              <span>Clear Results</span>
            </button>
          )}
        </div>

        {/* Manual Book Room Testing */}
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Manual Book Room Testing</h3>
          
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={currentBookRoom}
              onChange={(e) => setCurrentBookRoom(e.target.value)}
              placeholder="Enter book ID (e.g., OL123456W)"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={() => {
                if (currentBookRoom.trim()) {
                  joinBookRoom(currentBookRoom.trim());
                  addTestResult('Manual Test', 'success', `Joined room: ${currentBookRoom.trim()}`);
                }
              }}
              disabled={!isConnected || !currentBookRoom.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Join Room
            </button>
            <button
              onClick={() => {
                if (currentBookRoom.trim()) {
                  leaveBookRoom(currentBookRoom.trim());
                  addTestResult('Manual Test', 'success', `Left room: ${currentBookRoom.trim()}`);
                }
              }}
              disabled={!isConnected || !currentBookRoom.trim()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Leave Room
            </button>
          </div>
        </div>

        {/* Test Results */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Results</h3>
          
          {testResults.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No tests run yet. Click a test button to get started.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {testResults.map((result) => (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                >
                  {getStatusIcon(result.status)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">{result.test}</span>
                      <span className="text-sm text-gray-500">{result.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{result.message}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebSocketTester;