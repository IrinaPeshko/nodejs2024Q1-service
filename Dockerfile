# pull official base image
FROM node:slim

# install openssl to avoid errors in lohs
RUN apt-get update -y && apt-get install -y openssl

# set working directory
WORKDIR /app

# set url to connect to the db
ENV DATABASE_URL="postgresql://admin:root@host.docker.internal:5432/mydb?schema=public"

# build app
ADD . /app
RUN npm install

# run migration & start app
CMD npx prisma migrate dev --name init && npm run start
