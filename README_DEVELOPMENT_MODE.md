# BookHive Development Mode

## Email Verification System

In development mode, the email verification system is simplified to make testing easier:

### How it works:

1. **No Real Emails**: The system doesn't actually send emails to your address
2. **Fixed Verification Code**: Always use the code `123456` for verification
3. **No Backend Required**: Everything works without needing to run a backend server

### When signing up or logging in:

1. Enter any email address
2. Click "Verify Email Address"
3. In the verification form, you'll see a green box with the code `123456`
4. Enter this code in the verification fields
5. Click "Verify"

The verification will succeed, and you can continue using the application.

## Why Development Mode?

Development mode makes testing faster and more reliable by:

1. Eliminating the need for a real email server
2. Removing dependencies on external services
3. Making the verification process consistent and predictable
4. Allowing you to test without internet access

## Production Mode

In a production environment, the system would:
- Send actual emails with unique OTP codes
- Require users to check their email for the code
- Validate the entered code against the one sent

To implement production mode, you would need to:
1. Set up a real email service (like SendGrid, Mailgun, or Gmail)
2. Configure the backend server to handle OTP generation and verification
3. Update the frontend to use the real API endpoints

## Switching Between Modes

The code is structured to make it easy to switch between development and production modes. The relevant code is in:

- `src/context/AuthContext.jsx` - Contains the authentication logic
- `src/components/OTPVerification.jsx` - Handles the OTP verification UI
- `src/components/SignUp.jsx` and `src/components/Login.jsx` - Use the verification system

For now, enjoy the simplicity of development mode while building and testing your application!