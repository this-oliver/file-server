FROM node:16.13.0

WORKDIR /server

# fetch dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# copy source code
COPY src ./src
COPY README.md ./

# expose port
ENV PORT 4000

# start server
CMD [ "npm", "start" ]