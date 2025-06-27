# 🧪 BookHive API Testing Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Setup
1. Open Bruno Application
2. Import Collection: `/bruno` folder
3. Select Environment: **Local**
4. Ensure backend running: `http://localhost:3000`

### Step 2: Authentication Flow
```
Run in this order:
1. Auth/01-User-Signup.bru ✅
2. Auth/02-User-Login.bru ✅
3. Auth/03-Get-User-Profile.bru ✅
```

### Step 3: Test Protected APIs
```
Now all these will work automatically:
4. Books/02-Search-Books-OpenLibrary.bru ✅
5. Books/01-Get-All-Books.bru ✅
6. Books/03-Add-New-Book.bru ✅
7. Reviews/02-Create-Review-Request.bru ✅
```

## 🔐 JWT Token Management

### Automatic Token Handling:
- ✅ Token saves automatically after signup/login
- ✅ All protected routes use saved token
- ✅ No manual copying required
- ✅ Token refresh handled automatically

### Manual Token Check:
```javascript
// Check token in console
console.log("Current token:", bru.getEnvVar("token"));
```

## 📊 Success Indicators

### In Bruno Console:
```
✅ User created successfully
🔑 Token saved: eyJhbGciOiJIUzI1NiIsInR5cCI...
✅ Login successful
📚 Books fetched successfully
```

### Response Status Codes:
- `201` - Created (Signup, Add Book)
- `200` - Success (Login, Get Data)
- `401` - Unauthorized (Missing/Invalid Token)
- `400` - Bad Request (Invalid Data)

## 🚨 Troubleshooting

### Problem: 401 Unauthorized
**Solution**: Run login request again
```bash
Auth/02-User-Login.bru → Gets fresh token
```

### Problem: 404 Not Found
**Solution**: Check backend server
```bash
# Terminal check
curl http://localhost:3000/api/auth/profile
```

### Problem: OTP Verification
**Solution**: Check backend console
```bash
# Look for console output like:
OTP for user@email.com: 123456
OTP ID: otp_abc123xyz
```

## 📈 Advanced Usage

### Environment Switching:
1. **Local Development**: `http://localhost:3000/api`
2. **Production**: `https://your-api.onrender.com/api`

### Bulk Testing:
1. Select multiple requests
2. Right-click → "Run Selected"
3. Or use Collection Runner

### Custom Scripts:
```javascript
// Pre-request script example
bru.setVar("timestamp", Date.now());

// Post-response script example
if (res.status === 200) {
  bru.setVar("lastBookId", res.body.id);
}
```

## 📝 Test Data

### Sample User:
```json
{
  "username": "testuser123",
  "email": "test@bookhive.com",
  "password": "Test@123456"
}
```

### Sample Book:
```json
{
  "title": "Test Book API",
  "author": ["Test Author"],
  "genre": "Fiction",
  "publishedYear": 2024
}
```

---
**🎯 Goal**: All requests should return success status codes
**📋 Completion**: 14+ API endpoints tested
**⏱️ Time**: ~10 minutes for full test suite