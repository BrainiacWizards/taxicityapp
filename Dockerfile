# Use Node.js 20 as the base image
FROM node:20

# Set the working directory to the root
WORKDIR /app

# Copy the rest of the application files into the container
COPY . .

# Install dependencies for the entire project
RUN npm install --legacy-peer-deps

# Move the .env.template to .env
# RUN mv packages/react-app/.env.template packages/react-app/.env

# Change to the react-app directory and run the dev command
CMD cd packages/react-app && npm run dev

# Expose the port the app runs on
EXPOSE 3000
