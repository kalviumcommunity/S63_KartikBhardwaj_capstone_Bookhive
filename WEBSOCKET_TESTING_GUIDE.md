# 🔌 WebSocket Testing Guide for BookHive

## 📋 Overview
This guide will help you test the WebSocket implementation in your BookHive application. The WebSocket integration provides real-time notifications, user presence, and live updates.

## 🚀 Quick Start Testing

### 1. **Start the Application**

#### Backend:
```bash
cd S63_KartikBhardwaj_capstone_Bookhive/backend
npm install
npm run dev
```

#### Frontend:
```bash
cd S63_KartikBhardwaj_capstone_Bookhive/frontend
npm install
npm run dev
```

### 2. **Access Testing Interface**
- Navigate to: `http://localhost:5173/websocket-test`
- Login with your account to access WebSocket features

## 🧪 Testing Methods

### **Method 1: Automated Testing Dashboard**
1. Go to `/websocket-test` route
2. Click "Run All Tests" to execute comprehensive tests
3. Individual test buttons:
   - **Test Connection**: Verifies WebSocket connection
   - **Test Notifications**: Sends a test notification
   - **Test Book Rooms**: Tests joining/leaving book discussion rooms

### **Method 2: Visual Indicators**
1. **WebSocket Status Widget** (bottom-right corner):
   - Green = Connected
   - Red = Disconnected
   - Shows online users count
   - Expandable for detailed info

2. **Notification Bell** (top-right in navbar):
   - Shows unread notification count
   - Real-time notification popup
   - Click to view notification panel

### **Method 3: Manual Testing**

#### **Test Real-time Notifications:**
1. Open two browser windows/tabs
2. Login with different accounts in each
3. In one window, post a review on a book
4. Check if the other user receives a notification

#### **Test Book Room Functionality:**
1. Navigate to a book details page
2. Check console logs for "Joined book room" messages
3. Use the manual book room tester in `/websocket-test`

#### **Test User Presence:**
1. Login/logout in different tabs
2. Check the WebSocket status widget for online users
3. Verify user online/offline events in console

## 🔍 What to Look For

### **✅ Success Indicators:**
- Green connection status in WebSocket widget
- Console logs showing successful connection
- Toast notifications appearing
- Notification bell updating with new notifications
- Real-time updates without page refresh

### **❌ Failure Indicators:**
- Red connection status
- Console errors related to Socket.IO
- No real-time notifications
- Failed test results in testing dashboard

## 🐛 Troubleshooting

### **Connection Issues:**
1. **Check Backend Server:**
   ```bash
   # Should see these logs:
   # "Socket.IO server initialized"
   # "User [username] connected with socket ID: [id]"
   ```

2. **Check Frontend Console:**
   ```javascript
   // Should see:
   // "✅ Connected to Socket.IO server"
   // "Initializing Socket.IO connection..."
   ```

3. **Check Network Tab:**
   - Look for WebSocket connection in browser dev tools
   - Should see `ws://localhost:5001/socket.io/` connection

### **Authentication Issues:**
1. Ensure you're logged in
2. Check if JWT token exists in localStorage
3. Verify token is being sent in WebSocket auth

### **Notification Issues:**
1. Check if notification service is running
2. Verify database connection for notifications
3. Check browser notification permissions

## 📊 Testing Checklist

### **Basic Functionality:**
- [ ] WebSocket connects on login
- [ ] WebSocket disconnects on logout
- [ ] Connection status updates correctly
- [ ] Test notifications work

### **Real-time Features:**
- [ ] New review notifications
- [ ] User online/offline status
- [ ] Book room join/leave
- [ ] Notification panel updates

### **UI Components:**
- [ ] Notification bell shows unread count
- [ ] WebSocket status widget displays correctly
- [ ] Toast notifications appear
- [ ] Testing dashboard functions

### **Error Handling:**
- [ ] Graceful handling of connection loss
- [ ] Reconnection attempts
- [ ] Fallback when WebSocket unavailable

## 🔧 Development Tools

### **Browser Console Commands:**
```javascript
// Check WebSocket connection
window.socket?.connected

// Manual notification test
fetch('/api/notifications/test', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    type: 'new_review',
    title: 'Manual Test',
    message: 'Testing from console'
  })
})

// Check online users
window.onlineUsers
```

### **Backend Testing:**
```bash
# Check if Socket.IO is running
curl http://localhost:5001/socket.io/

# Test notification endpoint
curl -X POST http://localhost:5001/api/notifications/test \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"type":"new_review","title":"Test","message":"Test message"}'
```

## 📱 Mobile Testing
1. Test on mobile devices/responsive mode
2. Check touch interactions with notification panel
3. Verify WebSocket works on mobile networks

## 🚀 Production Testing
When deployed on Vercel + Render:
1. Update CORS origins in backend
2. Use HTTPS for WebSocket connections
3. Test with production URLs
4. Monitor connection stability

## 📈 Performance Monitoring
- Monitor WebSocket connection count
- Check memory usage with multiple connections
- Test with multiple users simultaneously
- Monitor notification delivery speed

## 🎯 Success Criteria
Your WebSocket implementation is working correctly when:
1. ✅ All automated tests pass
2. ✅ Real-time notifications work between users
3. ✅ Connection status updates accurately
4. ✅ No console errors related to WebSocket
5. ✅ Graceful handling of connection issues
6. ✅ UI components respond to real-time events

---

## 🆘 Need Help?
If you encounter issues:
1. Check the console logs (both frontend and backend)
2. Verify all dependencies are installed
3. Ensure ports 5001 (backend) and 5173 (frontend) are available
4. Check if firewall is blocking WebSocket connections
5. Test with a simple WebSocket client tool if needed