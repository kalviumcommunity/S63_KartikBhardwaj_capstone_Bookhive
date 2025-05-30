# BookHive Development Mode

This document explains how certain features work in development mode.

## Email OTP Verification

In development mode, the email OTP verification system uses a simplified approach to make testing easier:

### How it works:

1. When you click "Verify Email Address" or need to verify your email, the system will:
   - Skip the actual email sending (no real emails are sent)
   - Use a fixed OTP code: **123456**
   - Display this code directly in the verification form

2. To verify your email:
   - Enter the code **123456** in the verification form
   - Click "Verify"

### Why this approach?

- No need to set up real email servers for development
- No need to check your email for the code
- Works consistently even if the backend server is not running
- Makes testing faster and more reliable

### In Production

In a production environment, the system would:
- Send actual emails with unique OTP codes
- Require users to check their email for the code
- Validate the entered code against the one sent

## Other Development Mode Features

- User authentication is simulated with localStorage
- Book data is cached to reduce API calls
- Some features may have simplified implementations

## Switching to Production Mode

To switch to production mode:
1. Uncomment the production code in the relevant files
2. Set up the required backend services
3. Configure the necessary environment variables