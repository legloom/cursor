#!/bin/bash

echo "🚀 Deploying Guid Retail Analytics Platform..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

# Build the application
echo "🔨 Building application..."
npm run build

# Setup database (only if DATABASE_URL is provided)
if [ ! -z "$DATABASE_URL" ]; then
  echo "🗄️ Setting up database..."
  npx prisma db push
  
  # Seed database if it's empty
  echo "🌱 Seeding database..."
  npm run db:seed
fi

echo "✅ Deployment preparation complete!"
echo "🌐 Application is ready to serve at: $NEXT_PUBLIC_APP_URL"