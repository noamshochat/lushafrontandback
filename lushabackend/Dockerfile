FROM node:10

WORKDIR /usr/src/app

COPY lushabackend/package*.json ./package*.json ./

RUN npm install

COPY  lushabackend/ .

EXPOSE 8080

CMD ["node", "index.js"]