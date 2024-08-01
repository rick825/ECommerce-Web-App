# Stage 1: Build React client
FROM node:16 as client-build

# Set the working directory
WORKDIR /client

# Copy the package.json and package-lock.json files
COPY client/package.json client/package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY client ./

# Build the application
RUN npm run build

# Stage 2: Setup server
FROM node:16

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY server/package.json server/package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the server application code
COPY server ./

# Copy the client build output to the server
COPY --from=client-build /client/build /app/client/build

# Expose the port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
