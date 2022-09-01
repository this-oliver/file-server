FROM node:16.13.0

ENV PORT 4000

WORKDIR /server

COPY . /server

RUN npm install

CMD [ "npm", "start" ]