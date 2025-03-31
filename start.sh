#!/bin/sh

# Run migrations
npx prisma migrate deploy

# Start the application
npm run dev