# Use a Node.js image as the base
FROM node:18

# Set working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install dependencies with the legacy-peer-deps flag
RUN npm install --legacy-peer-deps

# Copy the entire project
COPY . .

# Move .env.template to .env in the react-app package
RUN mv packages/react-app/.env.template packages/react-app/.env

# Set the working directory to the react-app
WORKDIR /app/packages/react-app

# Expose the port your app will run on
EXPOSE 3000

# Run the application in development mode
CMD ["npm", "run", "dev"]
