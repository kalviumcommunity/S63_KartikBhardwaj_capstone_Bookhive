const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios');
const http = require('http');
const bookRoutes = require('./routes/bookRoutes');
const authRoutes = require('./routes/auth');
const reviewRoutes = require('./routes/reviews');
const reviewRequestRoutes = require('./routes/reviewRequestRoutes');
const otpRoutes = require('./routes/otp');
const aiRoutes = require('./routes/aiRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const contactRoutes = require('./routes/contactRoutes');
const seedBooks = require('./openServer'); 
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const socketService = require('./services/socketService');
require('./passport'); // Will create this file for Google OAuth config

dotenv.config();

// Set mongoose options to avoid deprecation warnings
mongoose.set('strictQuery', false);

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5001;

// CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://hilarious-taiyaki-51d18d.netlify.app',
    'https://bookhiveee.netlify.app'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// Proxy middleware for Open Library API
app.get('/api/proxy', async (req, res) => {
  try {
    const url = req.query.url;
    
    if (!url) {
      return res.status(400).json({ error: 'URL parameter is required' });
    }
    
    console.log(`Proxying request to: ${url}`);
    
    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch from external API',
      message: error.message
    });
  }
});

// Open Library API proxy
app.get('/api/openlibrary/*', async (req, res) => {
  try {
    const path = req.params[0];
    const url = `https://openlibrary.org/${path}${req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : ''}`;
    
    console.log(`Proxying OpenLibrary request to: ${url}`);
    
    const response = await axios.get(url, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('OpenLibrary proxy error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch from Open Library API',
      message: error.message
    });
  }
});

// Routes
app.use('/api/books', bookRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/review-requests', reviewRequestRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB connection with fallback
const connectDB = async () => {
  try {
    // Try MongoDB Atlas first
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Atlas connected successfully');
    seedBooks();
  } catch (err) {
    console.error('MongoDB Atlas connection failed:', err.message);
    console.log('Attempting to connect to local MongoDB...');
    
    try {
      // Fallback to local MongoDB
      await mongoose.connect('mongodb://localhost:27017/bookhive', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('Local MongoDB connected successfully');
      seedBooks();
    } catch (localErr) {
      console.error('Local MongoDB connection also failed:', localErr.message);
      console.log('Server will continue without database connection');
      console.log('Please check your MongoDB Atlas credentials or install MongoDB locally');
    }
  }
};

connectDB();

// Initialize Socket.IO
socketService.initialize(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Socket.IO server is ready for connections`);
});