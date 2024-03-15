# Use a specific Node.js version for consistency
ARG NODE_VERSION=20.8.1

# ---- Base Node ----
FROM node:${NODE_VERSION}-bullseye-slim AS base

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Copy the Prisma directory
COPY prisma ./prisma/

# Install all dependencies (including dev dependencies)
RUN npm install

# Copy the rest of the application code
COPY . .

# Copy the entire public directory (including views)
COPY public ./public

# ---- Build ----
FROM base AS build

# Run the build process for the application
RUN npm run build

# ---- Production ----
FROM node:${NODE_VERSION}-bullseye-slim AS production

# Set the working directory
WORKDIR /usr/src/app

# Copy built application files from the build stage
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/dist ./dist

# Copy Prisma directory for production
COPY --from=build /usr/src/app/prisma ./prisma

# Copy the entire public directory (including views)
COPY --from=build /usr/src/app/public ./public

# Copy package.json and package-lock.json to install only production dependencies
COPY package*.json ./

# Ensure that the lock file is up-to-date and matches the dependencies in package.json
RUN npm install --package-lock-only

# Install only production dependencies based on the updated lock file
RUN npm ci --only=production

# Run as non-root user
USER node

# Set the command to run the application
CMD ["npm", "run", "start:migrate:prod"]
