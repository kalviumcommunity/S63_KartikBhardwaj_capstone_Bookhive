# Using Mailtrap for Email Testing in BookHive

This guide explains how to use Mailtrap for testing email functionality in the BookHive application.

## What is Mailtrap?

Mailtrap is a fake SMTP server for development teams to test, view and share emails sent from the development and staging environments without sending them to real customers.

## How It Works

1. When a user signs up or requests an OTP, the application sends an email
2. Instead of going to the actual recipient's inbox, the email is captured by Mailtrap
3. You can view the email in the Mailtrap inbox to verify its content and formatting
4. The OTP code is still generated and stored in the application, so you can use it for verification

## Viewing Emails in Mailtrap

1. Go to [Mailtrap.io](https://mailtrap.io) and sign in
2. Navigate to the inbox
3. You'll see all emails sent by the application
4. Click on an email to view its content, including the OTP code

## Testing the OTP Flow

Since the emails are captured by Mailtrap and not delivered to the actual recipient, you need to:

1. Sign up with your email (e.g., kalviumkalvi@gmail.com)
2. Check the Mailtrap inbox to see the OTP that was generated
3. Use that OTP in the verification form

## For Development Testing Without Mailtrap

If you don't want to use Mailtrap, you can also:

1. Check the server console logs - the OTP is printed there:
   ```
   OTP for kalviumkalvi@gmail.com: 123456
   ```

2. Use this OTP in the verification form

## Switching to Real Email Delivery

When you're ready to send real emails:

1. Open the `otpService.js` file
2. Change the import from:
   ```javascript
   const { sendOTPEmail } = require('./mailtrapService');
   ```
   to:
   ```javascript
   const { sendOTPEmail } = require('./emailService');
   ```

3. Configure your email provider credentials in the `.env` file

## Troubleshooting

If you're having issues with the OTP verification:

1. Make sure the OTP service is using the correct email service
2. Check the server logs for any errors
3. Verify that the OTP is being generated and stored correctly
4. Ensure the verification endpoint is receiving the correct OTP and otpId