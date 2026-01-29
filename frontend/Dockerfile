# Frontend Dockerfile - Expo/React Native Web
FROM node:20-alpine

WORKDIR /app

# Install wget for healthcheck
RUN apk add --no-cache wget

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy the entire application
COPY . .

# Expose port for Expo web
EXPOSE 8081
EXPOSE 19006

# Health check - Expo dev server runs on 8081
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:8081 || exit 1

# Start Expo web server
CMD ["npx", "expo", "start", "--web", "--port", "8081"]
