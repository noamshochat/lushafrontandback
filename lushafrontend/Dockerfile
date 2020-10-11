FROM node:10

WORKDIR /usr/src/app

COPY lushafronttend/package*.json ./

RUN npm install

COPY lushafronttend/ .

EXPOSE 80

CMD ["node", "index.js"]