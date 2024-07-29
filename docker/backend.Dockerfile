ARG NODE_VERSION=lts-alpine

FROM node:${NODE_VERSION}

WORKDIR /services/backend

COPY . .

RUN corepack enable && corepack pnpm install

ENTRYPOINT ["npm", "run", "start:dev"]
