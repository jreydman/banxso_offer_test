ARG NODE_VERSION=lts-alpine

FROM node:${NODE_VERSION}

WORKDIR /services/frontend

COPY . .

RUN corepack enable && corepack pnpm install

ENTRYPOINT ["npm", "run", "start:dev"]
