FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

RUN npx prisma generate

RUN yarn build

CMD ["yarn", "run", "start:docker"]

EXPOSE 3010
