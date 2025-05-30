# Setting Up Gmail App Password for BookHive

To enable the BookHive application to send verification emails using your Gmail account, you need to set up an App Password. This is a 16-character code that allows the application to access your Gmail account securely without using your actual password.

## Prerequisites

1. You must have a Gmail account (kbrupc2020@gmail.com)
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
8. Copy this password

## Configuring BookHive to Use Your Gmail App Password

1. Open the `.env` file in the backend directory of your BookHive project
2. Update the following line with your app password:
   ```
   EMAIL_PASSWORD=your16characterpassword
   ```
3. Save the file

## Important Notes

- Do not include spaces in the app password when adding it to the `.env` file
- Keep your app password secure. It provides access to your Gmail account
- If you suspect your app password has been compromised, you can revoke it from the same App passwords page in your Google Account

## Testing the Email Service

After setting up your Gmail app password:

1. Start the backend server:
   ```
   ./start-backend.sh
   ```

2. Try signing up with a valid email address
3. You should receive an OTP at the provided email address
4. Enter the OTP in the verification form to complete the signup process

## Troubleshooting

If you encounter issues with email verification:

1. **Emails not being sent**:
   - Check if the Gmail app password is correct
   - Verify that 2-Step Verification is enabled on your Google account
   - Check the backend console for error messages

2. **Gmail security issues**:
   - Gmail might block the app if it detects unusual activity
   - Check your Gmail account for security notifications
   - You might need to allow "less secure apps" in your Google account settings

For any additional help, please contact the development team.