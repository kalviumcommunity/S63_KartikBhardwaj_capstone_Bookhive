// Simple test to check server startup
console.log('Testing server startup...');

try {
  require('./server.js');
  console.log('Server file loaded successfully');
} catch (error) {
  console.error('Error loading server:', error);
  process.exit(1);
}

// Exit after 5 seconds
setTimeout(() => {
  console.log('Test completed');
  process.exit(0);
}, 5000);