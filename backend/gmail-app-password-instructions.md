# How to Generate a Gmail App Password

To use your Gmail account for sending emails from the BookHive application, you need to generate an App Password. This is a 16-character code that allows the application to access your Gmail account securely without using your actual password.

## Prerequisites
1. You must have 2-Step Verification enabled on your Google Account.

## Steps to Generate an App Password

1. Go to your [Google Account](https://myaccount.google.com/).
2. Select **Security**.
3. Under "Signing in to Google," select **2-Step Verification**.
4. At the bottom of the page, select **App passwords**.
5. Enter a name for the app password (e.g., "BookHive").
6. Click **Create**.
7. Google will display a 16-character app password. 
8. Copy this password.
9. Open the `.env` file in the backend directory of your BookHive project.
10. Replace the placeholder in the `EMAIL_PASSWORD` field with your new app password:
    ```
    EMAIL_PASSWORD=your16characterpassword
    ```
11. Save the file.

## Important Notes
- Do not include spaces in the app password when adding it to the `.env` file.
- Keep your app password secure. It provides access to your Gmail account.
- If you suspect your app password has been compromised, you can revoke it from the same App passwords page in your Google Account.

After completing these steps, the BookHive application will be able to send verification emails using your Gmail account.