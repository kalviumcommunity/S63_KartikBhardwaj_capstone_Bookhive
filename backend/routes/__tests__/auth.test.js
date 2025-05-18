const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const authRoutes = require('../auth');

// Create a test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Mock User model methods
jest.mock('../../models/User');

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/signup', () => {
    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Please provide username, email and password');
    });

    it('should return 400 if user already exists', async () => {
      // Mock User.findOne to return a user
      User.findOne.mockResolvedValue({ username: 'existinguser', email: 'existing@example.com' });

      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          username: 'existinguser',
          email: 'existing@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User with this email or username already exists');
    });

    it('should create a new user and return token if valid data', async () => {
      // Mock User.findOne to return null (user doesn't exist)
      User.findOne.mockResolvedValue(null);
      
      // Mock User constructor and save method
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        username: 'newuser',
        email: 'new@example.com',
        role: 'user',
        save: jest.fn().mockResolvedValue(true)
      };
      User.mockImplementation(() => mockUser);
      
      // Mock jwt.sign
      jest.spyOn(jwt, 'sign').mockReturnValue('fake-token');

      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          username: 'newuser',
          email: 'new@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User created successfully');
      expect(response.body.token).toBe('fake-token');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.username).toBe('newuser');
      expect(mockUser.save).toHaveBeenCalled();
    });
  });

  describe('POST /api/auth/login', () => {
    it('should return 400 if required fields are missing', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Please provide email/username and password');
    });

    it('should return 401 if user not found', async () => {
      // Mock User.findOne to return null
      User.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: 'nonexistent',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should return 401 if password is incorrect', async () => {
      // Mock User.findOne to return a user
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        username: 'testuser',
        email: 'test@example.com',
        comparePassword: jest.fn().mockResolvedValue(false),
        save: jest.fn().mockResolvedValue(true)
      };
      User.findOne.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: 'testuser',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid credentials');
      expect(mockUser.comparePassword).toHaveBeenCalledWith('wrongpassword');
    });

    it('should return token if credentials are valid', async () => {
      // Mock User.findOne to return a user
      const mockUser = {
        _id: new mongoose.Types.ObjectId(),
        username: 'testuser',
        email: 'test@example.com',
        role: 'user',
        lastLogin: new Date(),
        comparePassword: jest.fn().mockResolvedValue(true),
        save: jest.fn().mockResolvedValue(true)
      };
      User.findOne.mockResolvedValue(mockUser);
      
      // Mock jwt.sign
      jest.spyOn(jwt, 'sign').mockReturnValue('fake-token');

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          identifier: 'testuser',
          password: 'correctpassword'
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.token).toBe('fake-token');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.username).toBe('testuser');
      expect(mockUser.save).toHaveBeenCalled(); // Should update lastLogin
    });
  });
});