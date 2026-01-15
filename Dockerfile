# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

COPY package.json package-lock.json ./
# Copy backend package files and install dependencies
RUN npm ci

# Copy backend source code
COPY backend/ ./backend

# Copy frontend
COPY frontend/ ./frontend

# Expose port
EXPOSE 3001

# Start app
CMD ["node", "backend/app.js"]
