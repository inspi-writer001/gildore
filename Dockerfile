FROM node:22

WORKDIR /app

# Copy package.json and yarn.lock first for better caching
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application
COPY . .

# Expose the port your Next.js app will run on
EXPOSE 3000

# Command to run the app
CMD ["yarn", "dev", "--host"]
