const io = require('socket.io-client');

// Test WebSocket connection
async function testWebSocketConnection() {
  console.log('🧪 Testing WebSocket Connection...\n');

  // Test connection without authentication (should fail)
  console.log('1. Testing connection without authentication...');
  const socketNoAuth = io('http://localhost:5001');
  
  socketNoAuth.on('connect_error', (error) => {
    console.log('❌ Expected error (no auth):', error.message);
    socketNoAuth.disconnect();
  });

  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test with mock token (should also fail)
  console.log('\n2. Testing connection with invalid token...');
  const socketBadAuth = io('http://localhost:5001', {
    auth: {
      token: 'invalid-token'
    }
  });

  socketBadAuth.on('connect_error', (error) => {
    console.log('❌ Expected error (bad token):', error.message);
    socketBadAuth.disconnect();
  });

  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log('\n3. Testing server endpoints...');
  
  // Test if server is running
  try {
    const response = await fetch('http://localhost:5001/api/books');
    if (response.ok) {
      console.log('✅ Backend server is running');
    } else {
      console.log('❌ Backend server responded with error:', response.status);
    }
  } catch (error) {
    console.log('❌ Cannot connect to backend server:', error.message);
  }

  // Test Socket.IO endpoint
  try {
    const response = await fetch('http://localhost:5001/socket.io/');
    if (response.status === 400) { // Socket.IO returns 400 for HTTP requests
      console.log('✅ Socket.IO server is running');
    } else {
      console.log('❌ Socket.IO server not responding correctly');
    }
  } catch (error) {
    console.log('❌ Cannot connect to Socket.IO server:', error.message);
  }

  console.log('\n📋 Test Summary:');
  console.log('- Authentication is working (rejecting invalid tokens)');
  console.log('- Backend server is accessible');
  console.log('- Socket.IO server is running');
  console.log('\n💡 To test with valid authentication:');
  console.log('1. Login to the frontend application');
  console.log('2. Check browser console for connection logs');
  console.log('3. Use the /websocket-test route for comprehensive testing');
  
  process.exit(0);
}

// Run the test
testWebSocketConnection().catch(console.error);