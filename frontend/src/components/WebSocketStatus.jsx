import React, { useState } from 'react';
import { useSocket } from '../context/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  WifiIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

const WebSocketStatus = () => {
  const { isConnected, onlineUsers } = useSocket();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
      >
        {/* Status Header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center space-x-3 p-3 w-full text-left transition-colors ${
            isConnected 
              ? 'bg-green-50 hover:bg-green-100' 
              : 'bg-red-50 hover:bg-red-100'
          }`}
        >
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <CheckCircleIcon className="w-5 h-5 text-green-600" />
            ) : (
              <XCircleIcon className="w-5 h-5 text-red-600" />
            )}
            <WifiIcon className={`w-5 h-5 ${
              isConnected ? 'text-green-600' : 'text-red-600'
            }`} />
          </div>
          
          <div className="flex-1">
            <p className={`text-sm font-medium ${
              isConnected ? 'text-green-800' : 'text-red-800'
            }`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </p>
            <p className={`text-xs ${
              isConnected ? 'text-green-600' : 'text-red-600'
            }`}>
              {isConnected 
                ? 'Real-time updates active' 
                : 'Trying to reconnect...'
              }
            </p>
          </div>

          {isExpanded ? (
            <ChevronDownIcon className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronUpIcon className="w-4 h-4 text-gray-500" />
          )}
        </button>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-gray-200"
            >
              <div className="p-3 space-y-3">
                {/* Connection Details */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">
                    Connection Status
                  </h4>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">WebSocket:</span>
                      <span className={`font-medium ${
                        isConnected ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {isConnected ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">Real-time notifications:</span>
                      <span className={`font-medium ${
                        isConnected ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {isConnected ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Online Users */}
                {isConnected && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Online Users ({onlineUsers.length})
                    </h4>
                    {onlineUsers.length > 0 ? (
                      <div className="max-h-24 overflow-y-auto space-y-1">
                        {onlineUsers.slice(0, 5).map((user) => (
                          <div key={user.userId} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            <span className="text-xs text-gray-700">{user.username}</span>
                          </div>
                        ))}
                        {onlineUsers.length > 5 && (
                          <p className="text-xs text-gray-500">
                            +{onlineUsers.length - 5} more users online
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">No other users online</p>
                    )}
                  </div>
                )}

                {/* Troubleshooting */}
                {!isConnected && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center space-x-1">
                      <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" />
                      <span>Troubleshooting</span>
                    </h4>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>• Check your internet connection</p>
                      <p>• Refresh the page if issues persist</p>
                      <p>• Some features may be limited</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default WebSocketStatus;