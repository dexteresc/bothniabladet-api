FROM mhart/alpine-node:latest

RUN mkdir /app
WORKDIR /app
COPY package.json /app
RUN npm install
COPY .env /app

RUN node install
