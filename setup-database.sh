#!/bin/bash

# Path to XAMPP's MySQL executable
MYSQL="/Applications/XAMPP/xamppfiles/bin/mysql"

# MySQL root credentials (default for XAMPP)
MYSQL_USER="root"
MYSQL_PASS=""

# Create database and user
$MYSQL -u $MYSQL_USER < create-database.sql

# Create .env file with database configuration
cat > .env << EOL
DATABASE_URL="mysql://kidscode_user:kidscode_password@localhost:3306/kidscode"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
EOL

# Install dependencies and set up database
npm install
npx prisma generate
npx prisma db push
npx prisma db seed

echo "Database setup complete! 🎉" 