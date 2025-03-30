#!/bin/bash

# Install client dependencies
echo "Installing client dependencies..."
npm install

# Install server dependencies
echo "Installing server dependencies..."
cd server
npm install
cd ..

echo "Setup complete! You can now run 'npm run dev' to start the application." 