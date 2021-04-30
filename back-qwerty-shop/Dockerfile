FROM node:16

# Create app directory, this is in our container/in our image
WORKDIR /lullofthesea/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

# RUN npm ci --only=production for production
RUN npm install

# Bundle app source
COPY . .

RUN npm run build

EXPOSE 8080
CMD [ "node", "dist/main" ]