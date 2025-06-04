#!/bin/bash

# Create .env file
cat > .env << EOL
# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/portfolio

# Session configuration
SESSION_SECRET=your-super-secret-key-change-in-production

# Admin credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
EOL

# Make the file readable only by the owner
chmod 600 .env

echo "Environment file created successfully!"
echo "Please update the SESSION_SECRET in .env with a secure value before deploying to production." 