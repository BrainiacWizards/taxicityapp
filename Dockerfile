# Use Node.js 20 as the base image
FROM node:20

# Setting the working directory in the container
WORKDIR /app

# Copying package.json and package-lock.json files
COPY ./package*.json ./

# Installing dependencies at the root level
RUN npm install --legacy-peer-deps

# Copy the rest of the application files
COPY . .

# Setting the working directory to the react-app directory
WORKDIR /app/packages/react-app

# Installing dependencies specific to react-app 
RUN npm install --legacy-peer-deps

# Exposing the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "dev"]
