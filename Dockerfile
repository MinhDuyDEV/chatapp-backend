# ### STAGE 1: Build the app ##
# # Use Node.js version 20
# FROM node:20 AS builder

# # Set working directory
# WORKDIR /usr/src/app

# # Copy package.json and package-lock.json
# COPY package.json package-lock.json ./

# # Install dependencies
# RUN npm install

# # Copy source code
# COPY . .

# # Build the app
# RUN npm run build


# ### STAGE 2: Run the app ##
# # Use Node.js version 20
# FROM node:20

# # Set working directory
# WORKDIR /usr/src/app

# # Copy package.json and package-lock.json
# COPY --from=builder /usr/src/app/package.json /usr/src/app/package-lock.json ./

# # Copy dist folder from the previous builder stage
# COPY --from=builder /usr/src/app/dist ./dist

# # Install production dependencies
# RUN npm install --only=production

# # Command to run the app in production mode
# ENTRYPOINT ["node", "dist/main.js"]


FROM node:20

# Set timezone for Node.js container
ENV TZ=Asia/Ho_Chi_Minh
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 8000

CMD ["npm", "run", "start:dev"]