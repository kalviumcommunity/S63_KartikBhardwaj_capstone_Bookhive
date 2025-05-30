#!/bin/bash

# Change to the backend directory
cd "$(dirname "$0")/S63_KartikBhardwaj_capstone_Bookhive/backend"

# Check if .env file exists
if [ ! -f .env ]; then
  echo "Error: .env file not found!"
  echo "Please create a .env file with your configuration."
  exit 1
fi

# Check if EMAIL_PASSWORD is set in .env
if ! grep -q "EMAIL_PASSWORD" .env; then
  echo "Warning: EMAIL_PASSWORD not found in .env file!"
  echo "Email verification will fall back to development mode."
fi

# Start the backend server
echo "Starting the backend server..."
node server.js