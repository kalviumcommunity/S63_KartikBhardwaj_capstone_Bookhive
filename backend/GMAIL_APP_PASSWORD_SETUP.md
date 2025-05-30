# Setting Up Gmail App Password for BookHive

To enable the BookHive application to send verification emails using Gmail, you need to set up an App Password. This is a 16-character code that allows the application to access Gmail securely without using your actual password.

## Important Update

**You need to set up a Gmail App Password to receive OTP emails in your inbox!**

Without this setup, OTPs will only be visible in the server console, not in your email inbox.

## Prerequisites

1. You need a Gmail account
2. You must have 2-Step Verification enabled on your Google Account

## Steps to Generate a Gmail App Password

1. Go to your [Google Account](https://myaccount.google.com/)
2. Select **Security** from the left navigation panel
3. Under "Signing in to Google," select **2-Step Verification**
   - If you haven't set up 2-Step Verification yet, you'll need to do that first
4. At the bottom of the page, select **App passwords**
5. Enter a name for the app password (e.g., "BookHive")
6. Click **Create**
7. Google will display a 16-character app password
8. Copy this password (it will look something like: abcd efgh ijkl mnop)

## Configuring BookHive to Use Your Gmail App Password

1. Open the `.env` file in the backend directory of your BookHive project
2. Update the following line with your app password (remove any spaces):
   ```
   EMAIL_PASSWORD=abcdefghijklmnop
   ```
3. Save the file

## Important Notes

- Do not include spaces in the app password when adding it to the `.env` file
- Keep your app password secure. It provides access to your Gmail account
- If you suspect your app password has been compromised, you can revoke it from the same App passwords page in your Google Account

## Testing the Email Service

After setting up your Gmail app password:

1. Restart the backend server:
   ```
   cd backend
   npm run dev
   ```

2. Try signing up with a valid email address
3. You should receive an OTP at the provided email address
4. Enter the OTP in the verification form to complete the signup process

## Troubleshooting

If you encounter issues with email verification:

1. **Emails not being sent**:
   - Check if the Gmail app password is correct in the `.env` file
   - Verify that 2-Step Verification is enabled on your Google account
   - Check the backend console for error messages

2. **Gmail security issues**:
   - Gmail might block the app if it detects unusual activity
   - Check your Gmail account for security notifications
   - You might need to allow "less secure apps" in your Google account settings

3. **Using the console OTP as a fallback**:
   - If email delivery fails, you can still use the OTP displayed in the server console
   - Look for a message like: `📧 VERIFICATION CODE for email@example.com: 123456`

For any additional help, please contact the development team.