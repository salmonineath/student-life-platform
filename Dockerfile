# Use Node image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Build Next.js
RUN npm run build

# Expose port
EXPOSE 3000

# Run Next.js
CMD ["npm", "start"]