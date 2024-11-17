### STAGE 1: Build the app ##
# Use Node.js version 20
FROM node:20 AS builder

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build


### STAGE 2: Run the app ##
# Use Node.js version 20
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY --from=builder /usr/src/app/package.json /usr/src/app/package-lock.json ./

# Copy dist folder from the previous builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Install production dependencies
RUN npm install --only=production

# Command to run the app in production mode
ENTRYPOINT ["node", "dist/main.js"]