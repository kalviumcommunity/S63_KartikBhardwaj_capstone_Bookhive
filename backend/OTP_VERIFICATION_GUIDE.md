# OTP Verification Guide for BookHive

This guide explains how to use the OTP verification system in BookHive.

## How OTP Verification Works

When a user signs up or requests an OTP:

1. The system generates a 6-digit OTP code
2. The OTP is displayed in the server console (terminal)
3. The OTP is also sent to the user's email address (if Gmail is configured)
4. The user enters the OTP in the verification form to complete the process

## Setting Up Gmail for OTP Delivery

To receive OTPs in your email inbox:

1. Follow the instructions in `GMAIL_APP_PASSWORD_SETUP.md` to set up a Gmail app password
2. Add the app password to the `.env` file:
   ```
   EMAIL_PASSWORD=your_app_password_here
   ```
3. Restart the server

## Finding the OTP in the Console

When an OTP is generated, it will be displayed prominently in the server console like this:

```
======================================================
📧 VERIFICATION CODE for kalviumkalvi@gmail.com: 460690
======================================================
```

## Step-by-Step Guide for Testing

### For Developers:

1. Start the backend server:
   ```
   cd backend
   npm run dev
   ```

2. Keep the terminal window visible so you can see the OTP codes

3. When a user signs up or requests an OTP, look for the verification code in the console

### For Users:

1. Sign up with your email (e.g., kalviumkalvi@gmail.com)

2. After submitting the signup form, the system will generate an OTP and:
   - Send it to your email (if Gmail is configured)
   - Display it in the server console

3. Check your email inbox for the OTP or ask the developer to provide you with the OTP from the console

4. Enter this OTP in the verification form

## Testing Gmail Configuration

To test if your Gmail configuration is working:

1. Run the test script:
   ```
   node test-gmail-service.js your_email@gmail.com
   ```

2. Check your email inbox for the test email

## Troubleshooting

If you're having issues with OTP verification:

1. **Not receiving emails**:
   - Check if the Gmail app password is correctly set in the `.env` file
   - Verify that 2-Step Verification is enabled on your Google account
   - Check the backend console for error messages
   - Look in your spam/junk folder

2. **OTP not showing in console**: 
   - Make sure the server is running and you're looking at the correct terminal window

3. **OTP not working**: 
   - Check that you're entering the correct OTP and that it hasn't expired (OTPs expire after 5 minutes)

4. **User not found**: 
   - Make sure the user exists in the database

5. **Verification failing**: 
   - Ensure you're using the correct otpId and userId in the verification request