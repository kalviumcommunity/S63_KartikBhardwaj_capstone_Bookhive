# Email Verification Setup Guide

BookHive uses email verification for user accounts to enhance security and ensure that users provide valid email addresses. This guide explains how to set up and configure the email verification system.

## How It Works

1. When a user signs up or needs to verify their email, the system sends a 6-digit OTP (One-Time Password) to their email address.
2. The user enters this OTP in the verification form.
3. If the OTP is correct and hasn't expired, the user's email is marked as verified.

## Technical Implementation

### Backend Components

1. **Email Service**: Uses Nodemailer to send emails through Gmail.
   - File: `backend/services/emailService.js`

2. **OTP Service**: Generates, stores, and verifies OTPs.
   - File: `backend/services/otpService.js`

3. **OTP Routes**: API endpoints for sending and verifying OTPs.
   - File: `backend/routes/otp.js`

### Frontend Components

1. **OTP Verification Component**: UI for entering and verifying OTPs.
   - File: `frontend/src/components/OTPVerification.jsx`

2. **Auth Context**: Manages authentication state and OTP verification.
   - File: `frontend/src/context/AuthContext.jsx`

## Setup Instructions

### 1. Gmail App Password Setup

To use Gmail for sending verification emails, you need to set up an App Password:

1. Follow the instructions in `backend/gmail-app-password-instructions.md`
2. Update the `.env` file with your Gmail app password:

```
EMAIL_PASSWORD=your_app_password_here
```

### 2. Environment Variables

Make sure the following environment variables are set in your `.env` file:

```
# Email Configuration
EMAIL_PASSWORD=your_app_password_here
```

### 3. Testing the Email Verification

1. Start the backend server:
   ```
   cd backend
   npm start
   ```

2. Start the frontend development server:
   ```
   cd frontend
   npm run dev
   ```

3. Try to sign up with a valid email address.
4. You should receive an OTP at the provided email address.
5. Enter the OTP in the verification form to complete the signup process.

## Troubleshooting

If you encounter issues with email verification:

1. **Emails not being sent**:
   - Check if the Gmail app password is correct
   - Verify that 2-Step Verification is enabled on your Google account
   - Check the backend console for error messages

2. **OTP verification failing**:
   - Make sure you're entering the correct OTP
   - Check if the OTP has expired (valid for 5 minutes)
   - Verify that the backend server is running

3. **Gmail security issues**:
   - Gmail might block the app if it detects unusual activity
   - Check your Gmail account for security notifications
   - You might need to allow "less secure apps" in your Google account settings

## Security Considerations

- OTPs expire after 5 minutes for security
- OTPs are stored in memory (for development) - in production, use Redis or another database
- Email verification helps prevent account abuse and spam

For any additional help, please contact the development team.