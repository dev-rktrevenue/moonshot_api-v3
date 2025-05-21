# Use Puppeteer base image with Chrome and Node.js pre-installed
FROM ghcr.io/puppeteer/puppeteer:latest

# Set working directory
WORKDIR /app

# Ensure we're root for file permission fixes
USER root

# Copy package files and fix permissions
COPY package*.json ./
RUN chown -R pptruser:pptruser /app

# Switch to Puppeteer user (non-root)
USER pptruser

# Install dependencies as non-root user
RUN npm install

# Copy the rest of the app and ensure correct ownership
USER root
COPY . .
RUN chown -R pptruser:pptruser /app

USER pptruser

# Expose Express port
EXPOSE 3000

# Start the app
CMD ["node", "app.js"]
