FROM node:16

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Ensure the client build is in place
COPY --from=client-build /app/build /app/client/build

# Expose the port
EXPOSE 5000

# Start the server
CMD ["node", "server.js"]
