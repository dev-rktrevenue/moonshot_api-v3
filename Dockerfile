# Use Puppeteer base image with Node.js + Chrome pre-installed
FROM ghcr.io/puppeteer/puppeteer:latest

# Set working directory
WORKDIR /app

# Copy package files and fix permissions
COPY package*.json ./
RUN chown -R pptruser:pptruser /app

# Switch to the non-root Puppeteer user
USER pptruser

# Install Node.js dependencies
RUN npm install

# Copy the rest of your app (also fix permissions)
COPY --chown=pptruser:pptruser . .

# Expose the port your Express app uses
EXPOSE 3000

# Start the app
CMD ["node", "app.js"]
