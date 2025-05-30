# Using Console OTP Service for BookHive

This guide explains how to use the Console OTP Service for testing email verification in the BookHive application.

## What is the Console OTP Service?

The Console OTP Service is a simplified implementation that displays OTP codes in the server console instead of sending them via email. This is useful for development and testing when you don't want to set up a real email service.

## How It Works

1. When a user signs up or requests an OTP, the application generates an OTP code
2. Instead of sending the OTP via email, it's displayed in the server console
3. You can see the OTP in the console and use it for verification
4. The OTP is still stored in the application's memory, so the verification process works normally

## Using the Console OTP Service

### Step 1: Start the server

```bash
cd backend
npm run dev
```

### Step 2: Sign up or request an OTP

Use the application normally to sign up or request an OTP for email verification.

### Step 3: Check the server console

Look for a message like this in the server console:

```
======================================================
📧 VERIFICATION CODE for kalviumkalvi@gmail.com: 786209
======================================================
```

### Step 4: Use the OTP for verification

Enter the OTP code from the console into the verification form in the application.

## Benefits of the Console OTP Service

1. **No email configuration needed**: You don't need to set up a real email service
2. **Instant feedback**: You can see the OTP immediately in the console
3. **Works for any email address**: You can use any email address for testing, even if you don't have access to it
4. **No risk of spam**: Since no actual emails are sent, there's no risk of sending unwanted emails

## Switching to Real Email Delivery

When you're ready to use real email delivery:

1. Update the OTP routes in `routes/otp.js` to use a real email service
2. Configure your email provider credentials in the `.env` file

## Troubleshooting

If you're having issues with the OTP verification:

1. Make sure the server is running and you can see the console output
2. Check that the OTP is being generated and displayed in the console
3. Verify that you're entering the correct OTP in the verification form
4. Ensure the OTP hasn't expired (they expire after 5 minutes)