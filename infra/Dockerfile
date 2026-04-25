# Use a Node.js base image
FROM node:20-alpine AS development

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Run lint and tests
RUN npm run lint
RUN npm run test -- --no-watchman

# Build the NestJS application
RUN npm run build

# Use a smaller base image for production
FROM node:20-alpine AS production

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install production dependencies only
RUN npm install --only=production

# Copy the built application from the development stage
COPY --from=development /app/dist ./dist
COPY --from=development /app/node_modules ./node_modules
COPY --from=development /app/package.json ./package.json

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "dist/main"]
