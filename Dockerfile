# Use Node.js 20 Alpine for a smaller image
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Remove dev dependencies to keep image lean
RUN npm prune --omit=dev

# Production image
FROM node:20-alpine
WORKDIR /app

# Copy application from build stage
COPY --from=build /app /app

# Expose the port used by the Express server
EXPOSE 8080

# Start the server
CMD ["node", "server.js"]
