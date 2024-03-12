# pull official base image
FROM node:slim

# set working directory
WORKDIR /app

# build app
ADD . /app
RUN npm install

# start app
CMD [ \
    "npm", \
    "run", \
    "start" \
]