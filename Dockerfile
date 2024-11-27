# dockerfile used for production. no further configuration is needed

FROM node:20.9.0-slim AS base

RUN apt-get update -y && apt-get install -y --no-install-recommends openssl \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

################################################################################

FROM base AS builder

COPY package.json yarn.lock ./

ENV NODE_ENV=production

RUN yarn install

COPY . .

RUN yarn build && yarn generate --generator client

################################################################################

FROM base AS runner

COPY --from=builder /home/node/app/dist /home/node/app/dist

COPY --from=builder /home/node/app/node_modules /home/node/app/node_modules

COPY --from=builder /home/node/app/prisma /home/node/app/prisma

RUN chown -R node:node /home/node/app/node_modules/.prisma && chown -R node:node /home/node/app/prisma/

USER node

EXPOSE 3001

CMD [ "node", "dist/src/server.js" ]

# para a documentação seguida para construção desse arquivo, vá para o step 3 do link:

# https://www.digitalocean.com/community/tutorials/como-construir-uma-aplicacao-node-js-com-o-docker-pt
