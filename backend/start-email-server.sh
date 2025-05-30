#!/bin/bash

# Check if .env file exists
if [ ! -f .env ]; then
  echo "Error: .env file not found!"
  echo "Please create a .env file with your Gmail app password."
  echo "See GMAIL_APP_PASSWORD_SETUP.md for instructions."
  exit 1
fi

# Check if GMAIL_APP_PASSWORD is set in .env
if ! grep -q "GMAIL_APP_PASSWORD" .env; then
  echo "Error: GMAIL_APP_PASSWORD not found in .env file!"
  echo "Please add your Gmail app password to the .env file."
  echo "See GMAIL_APP_PASSWORD_SETUP.md for instructions."
  exit 1
fi

# Start the email server
echo "Starting the real email server..."
node real-email-server.js