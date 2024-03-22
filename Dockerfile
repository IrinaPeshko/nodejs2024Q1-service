FROM node:18-alpine as build

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

FROM node:18-alpine as main

WORKDIR /app

COPY --from=build /app /app

CMD npx prisma migrate dev --name init && npm run start:dev