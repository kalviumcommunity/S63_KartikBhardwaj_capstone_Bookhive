const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../models/User');
const auth = require('../auth');

// Mock the User model
jest.mock('../../models/User');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup request, response, and next function
    req = {
      header: jest.fn(),
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('should return 401 if no token is provided', async () => {
    // Mock no Authorization header
    req.header.mockReturnValue(null);

    await auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No authentication token, access denied' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token format is invalid', async () => {
    // Mock invalid token format
    req.header.mockReturnValue('InvalidToken');

    await auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No authentication token, access denied' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', async () => {
    // Mock valid token format but invalid token
    req.header.mockReturnValue('Bearer invalidtoken');
    
    // Mock jwt.verify to throw error
    jest.spyOn(jwt, 'verify').mockImplementation(() => {
      throw new Error('Invalid token');
    });

    await auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(jwt.verify).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if user not found', async () => {
    // Mock valid token
    const userId = new mongoose.Types.ObjectId().toString();
    req.header.mockReturnValue('Bearer validtoken');
    
    // Mock jwt.verify to return valid decoded token
    jest.spyOn(jwt, 'verify').mockReturnValue({ userId });
    
    // Mock User.findById to return null and mock the select method
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    });

    await auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    expect(User.findById).toHaveBeenCalledWith(userId);
    expect(next).not.toHaveBeenCalled();
  });

  it('should set req.user and req.token and call next() if token is valid', async () => {
    // Mock valid token
    const userId = new mongoose.Types.ObjectId().toString();
    const token = 'validtoken';
    req.header.mockReturnValue(`Bearer ${token}`);
    
    // Mock jwt.verify to return valid decoded token
    jest.spyOn(jwt, 'verify').mockReturnValue({ userId });
    
    // Mock User.findById to return a user with select method
    const mockUser = { _id: userId, username: 'testuser' };
    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(mockUser)
    });

    await auth(req, res, next);

    expect(req.user).toEqual(mockUser);
    expect(req.token).toBe(token);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });
});