FROM node:18.13.0-alpine as builder

RUN mkdir -p /usr/src/app
RUN npm i -g pnpm
RUN apk add --update python3 py3-pip
RUN apk add --update make g++

WORKDIR /usr/src/app
COPY . /usr/src/app
RUN pnpm i

FROM node:18.13.0-alpine as app

RUN mkdir -p /usr/src/app
RUN npm i -g npm
WORKDIR /usr/src/app

COPY --from=builder /usr/src/app /usr/src/app

EXPOSE 3000
CMD [ "npm", "start" ]
