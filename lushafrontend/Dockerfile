FROM node:10

WORKDIR /usr/src/app

COPY lushafrontend/package*.json ./

RUN npm install

COPY lushafrontend/ .

EXPOSE 80

CMD ["node", "index.js"]