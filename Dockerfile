FROM node:10.18-alpine

RUN apk add --no-cache --update python2 make g++
# && ln -s /usr/bin/python2 /usr/bin/python

COPY package.json .

COPY yarn.lock .

RUN MAKEFLAGS="-j$(nproc)" yarn add bitcoinjs-lib && MAKEFLAGS="-j$(nproc)" yarn install

COPY . .

RUN yarn run generate

ENTRYPOINT [ "node" ]

CMD [ "server.js" ]
