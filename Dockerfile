FROM node:16-slim

WORKDIR /files

ADD package.json package-lock.json /files/
RUN npm ci

ADD . /files/

CMD ["npm", "start"]
