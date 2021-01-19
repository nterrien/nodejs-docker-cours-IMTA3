FROM node:latest

# Create app directory
WORKDIR /usr/src/app

COPY package.json .

# Install all Packages
RUN npm install

COPY . .

# Start
CMD npm run start
EXPOSE 5000