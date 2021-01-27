FROM node:latest

# Create app directory
WORKDIR /usr/src/app

COPY package.json .

# Install all Packages
RUN npm install

COPY . .

# Add docker-compose-wait tool
ENV WAIT_VERSION 2.7.2
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/$WAIT_VERSION/wait /wait
RUN chmod +x /wait

# Start
CMD npm run start
EXPOSE 5000