# Use the Node.js 20 base image for building
FROM node:20 AS build

# Install pnpm globally
RUN npm install -g pnpm

# Set the working directory in the container
WORKDIR /app

# Copy pnpm workspace configuration and lockfile for dependency installation
COPY pnpm-workspace.yaml ./
COPY package.json pnpm-lock.yaml ./

# Install all monorepo dependencies
RUN pnpm install --frozen-lockfile

# Copy the backend project code
COPY apps/backend ./apps/backend

# Install only backend dependencies
RUN pnpm install --filter ./apps/backend --frozen-lockfile

# Build the backend project (if there's a build step)
RUN pnpm --filter ./apps/backend run build

# Prune development dependencies to reduce image size
RUN pnpm prune --prod --filter ./apps/backend

# Use a smaller Node.js runtime image for production
FROM node:20-slim

# Set the working directory in the container
WORKDIR /app

# Copy the backend build output and node_modules from the build stage
COPY --from=build /app/apps/backend/dist ./dist
COPY --from=build /app/apps/backend/node_modules ./node_modules

# Copy the package.json to ensure runtime dependencies are available
COPY --from=build /app/apps/backend/package.json ./

# Set environment variables
ENV NODE_ENV=production

# Expose the port your app runs on (adjust if different)
EXPOSE 3000

# Command to run the backend server
CMD ["node", "dist/index.js"]
