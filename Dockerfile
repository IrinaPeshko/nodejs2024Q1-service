FROM node:18-alpine as build

WORKDIR /app

COPY package*.json .

ENV DATABASE_URL="postgresql://admin:root@host.docker.internal:5432/mydb?schema=public"

RUN npm install

COPY . .

FROM node:18-alpine as main

WORKDIR /app

COPY --from=build /app /app

CMD npx prisma migrate dev --name init && npm run start:dev