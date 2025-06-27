# 📚 BookHive API Collection - Bruno Templates

This folder contains comprehensive API testing templates for the BookHive application using Bruno API client.

## 🔧 Setup Instructions

### Prerequisites
- Bruno API client installed
- BookHive backend running on `http://localhost:3000/api`
- Valid test credentials

### Quick Start
1. Open Bruno
2. Import this collection: File → Import Collection
3. Select the `bruno` folder
4. Choose environment: Local or Production
5. Run authentication requests first to get JWT token

## 📁 Collection Structure

```
bruno/
├── environments/
│   ├── Local.bru              # Local development variables
│   └── Production.bru         # Production environment
├── Auth/
│   ├── 01-User-Signup.bru     # Create new user account
│   ├── 02-User-Login.bru      # Login with credentials
│   ├── 03-Get-User-Profile.bru # Fetch user profile (Protected)
│   ├── 04-Verify-Email-OTP.bru # Email verification
│   └── 05-Resend-OTP.bru      # Resend verification code
├── Books/
│   ├── 01-Get-All-Books.bru   # Fetch books from MongoDB
│   ├── 02-Search-Books-OpenLibrary.bru # Search via OpenLibrary API
│   ├── 03-Add-New-Book.bru    # Add book to database
│   └── 04-Get-Book-Reviews.bru # Get reviews for specific book
├── Reviews/
│   ├── 01-Get-All-Review-Requests.bru # Fetch review requests
│   ├── 02-Create-Review-Request.bru   # Create new review request
│   └── 03-Fulfill-Review-Request.bru  # Mark request as fulfilled
├── Users/
│   └── 01-Upload-Profile-Photo.bru    # Upload user profile image
├── Contact/
│   └── 01-Submit-Contact-Form.bru     # Submit contact form
└── bruno.json                 # Collection metadata
```

## 🔐 Authentication Flow

### Step 1: Signup
- Run `Auth/01-User-Signup.bru`
- Token automatically saved to environment variables
- User ID saved for subsequent requests

### Step 2: Email Verification (Optional)
- Check backend console for OTP
- Update `Auth/04-Verify-Email-OTP.bru` with OTP values
- Run verification request

### Step 3: Login
- Run `Auth/02-User-Login.bru`
- Updated token saved automatically

### Step 4: Protected Routes
- All other requests use the saved token automatically
- Profile, Books, Reviews require authentication

## 🌍 Environment Variables

### Local Environment
```
baseUrl: http://localhost:3000/api
token: (auto-populated after login)
userId: (auto-populated after signup)
bookId: (auto-populated from search)
testEmail: test@bookhive.com
testPassword: Test@123456
```

### Production Environment
```
baseUrl: https://your-production-api.onrender.com/api
token: (auto-populated after login)
userId: (auto-populated after signup)
bookId: (auto-populated from search)
testEmail: prod.test@bookhive.com
testPassword: Test@123456
```

## 🧪 Testing Workflow

### Recommended Order:
1. **Authentication**: Run signup → login → get profile
2. **Books**: Search books → get all books → add book
3. **Reviews**: Create review request → get requests
4. **Users**: Upload profile photo
5. **Contact**: Submit contact form

### JWT Token Management:
- Tokens auto-save after successful login/signup
- No manual token copying required
- Token automatically included in protected endpoints

## 📊 Test Assertions

Each request includes:
- **Status Code Validation**: Ensures correct HTTP response
- **Response Structure Validation**: Checks for required fields
- **Data Type Validation**: Verifies data types
- **Business Logic Validation**: Confirms expected behavior

## 🚨 Troubleshooting

### Common Issues:
1. **401 Unauthorized**: Run login first to get fresh token
2. **404 Not Found**: Check if backend server is running
3. **400 Bad Request**: Verify request body format
4. **OTP Issues**: Check backend console for OTP values

### Debug Tips:
- Check console logs in post-response scripts
- Verify environment variables are set
- Ensure backend server is running on correct port

## 🔄 Variables Auto-Population

The collection automatically manages these variables:
- `token`: JWT token from auth responses
- `userId`: User ID from signup/login
- `bookId`: Book ID from search results
- `reviewRequestId`: Review request ID from creation
- `testBookId`: Book ID from book creation

## 📝 API Endpoints Covered

### Authentication (5 endpoints)
- POST `/auth/signup` - User registration
- POST `/auth/login` - User authentication
- GET `/auth/profile` - Get user profile
- POST `/auth/verify-email` - Email verification
- POST `/auth/resend-otp` - Resend OTP

### Books (4 endpoints)
- GET `/books` - Get all books with pagination
- GET `/books/search` - Search OpenLibrary API
- POST `/books` - Add new book to database
- GET `/books/works/:bookId` - Get book reviews

### Review Requests (3 endpoints)
- GET `/review-requests` - Get all review requests
- POST `/review-requests` - Create review request
- PUT `/review-requests/:id/fulfill` - Mark as fulfilled

### Users (1 endpoint)
- POST `/users/upload-photo` - Upload profile photo

### Contact (1 endpoint)
- POST `/contact/submit` - Submit contact form

## 🎯 Success Criteria

✅ All API endpoints documented
✅ Environment variables configured
✅ JWT authentication flow working
✅ Auto-token management implemented
✅ Test assertions added
✅ Error handling covered
✅ Documentation complete

---

**Created for**: BookHive Application
**Testing Tool**: Bruno API Client
**Author**: Kartik Bhardwaj
**Last Updated**: $(date)