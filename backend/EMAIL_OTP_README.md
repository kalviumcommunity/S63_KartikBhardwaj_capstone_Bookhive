# Email OTP Verification System for BookHive

This document explains how the Email OTP Verification System works in BookHive and how to test it.

## Overview

BookHive uses a hybrid OTP (One-Time Password) verification system that:

1. Generates a 6-digit OTP when a user signs up or requests verification
2. Displays the OTP in the server console (for development/debugging)
3. Sends the OTP to the user's email address (if Gmail is configured)
4. Verifies the OTP when the user enters it

## Configuration

The system is already configured to use Gmail for sending emails. The Gmail credentials are set in the `.env` file:

```
EMAIL_USER=kbrupc2020@gmail.com
EMAIL_FROM=kbrupc2020@gmail.com
EMAIL_PASSWORD=wpnfuzgzlkjreebe
```

## Testing the System

You can test the complete OTP flow using the provided script:

```
cd backend
node complete-otp-flow.js your_email@gmail.com
```

This script will:
1. Generate an OTP and send it to your email
2. Prompt you to enter the OTP
3. Verify the OTP and show the result

## How It Works in the Application

When a user signs up in the BookHive application:

1. The system creates a new user account with `isEmailVerified: false`
2. An OTP is generated and sent to the user's email
3. The user is prompted to enter the OTP
4. When the correct OTP is entered, the user's account is marked as verified

## Files Involved

- `services/hybridOtpService.js` - The main OTP service that generates and verifies OTPs
- `services/gmailService.js` - The email service that sends OTPs via Gmail
- `routes/auth.js` - The authentication routes that use the OTP service
- `routes/otp.js` - Additional OTP-related routes (resend OTP, etc.)

## Troubleshooting

If you're having issues with the OTP verification system:

1. **Not receiving emails**:
   - Check if the Gmail app password is correctly set in the `.env` file
   - Verify that 2-Step Verification is enabled on your Google account
   - Check the backend console for error messages
   - Look in your spam/junk folder

2. **OTP verification failing**:
   - Make sure you're entering the correct OTP
   - OTPs expire after 5 minutes
   - OTPs can only be used once

## Additional Resources

- `GMAIL_APP_PASSWORD_SETUP.md` - Instructions for setting up a Gmail app password
- `OTP_VERIFICATION_GUIDE.md` - Detailed guide for using the OTP verification system
- `test-gmail-service.js` - Script for testing the Gmail service
- `test-hybrid-otp.js` - Script for testing the hybrid OTP service
- `complete-otp-flow.js` - Script for testing the complete OTP flow