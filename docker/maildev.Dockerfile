FROM node:lts-alpine

RUN npm i -g maildev@latest

ENTRYPOINT [ "maildev" ]