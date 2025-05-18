const mongoose = require('mongoose');
const User = require('../User');

// Use a separate test database
beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/bookhive_test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

// Clear users after each test
afterEach(async () => {
  await User.deleteMany({});
});

// Disconnect after all tests
afterAll(async () => {
  await mongoose.connection.close();
});

describe('User Model', () => {
  it('should create a new user successfully', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    };

    const user = new User(userData);
    const savedUser = await user.save();

    // Verify saved user
    expect(savedUser._id).toBeDefined();
    expect(savedUser.username).toBe(userData.username);
    expect(savedUser.email).toBe(userData.email);
    // Password should be hashed
    expect(savedUser.password).not.toBe(userData.password);
  });

  it('should require username, email, and password', async () => {
    const user = new User({});
    
    let error;
    try {
      await user.save();
    } catch (e) {
      error = e;
    }
    
    expect(error).toBeDefined();
    expect(error.errors.username).toBeDefined();
    expect(error.errors.email).toBeDefined();
  });

  it('should not allow duplicate usernames', async () => {
    // Create first user
    const firstUser = new User({
      username: 'sameuser',
      email: 'first@example.com',
      password: 'password123',
    });
    await firstUser.save();

    // Try to create second user with same username
    const secondUser = new User({
      username: 'sameuser',
      email: 'second@example.com',
      password: 'password456',
    });

    let error;
    try {
      await secondUser.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.code).toBe(11000); // Duplicate key error
  });

  it('should correctly compare passwords', async () => {
    const password = 'testpassword123';
    const user = new User({
      username: 'passwordtester',
      email: 'password@test.com',
      password,
    });
    await user.save();

    // Test correct password
    const isMatch = await user.comparePassword(password);
    expect(isMatch).toBe(true);

    // Test incorrect password
    const isWrongMatch = await user.comparePassword('wrongpassword');
    expect(isWrongMatch).toBe(false);
  });
});