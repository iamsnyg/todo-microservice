# Stage 1: Dependencies + Prisma
FROM node:22-alpine AS dependencies

RUN apk update \
    && apk upgrade --no-cache \
    && apk add --no-cache \
        libcrypto3=3.5.8-r0 \
        libssl3=3.5.8-r0

WORKDIR /app

COPY package*.json ./
RUN npm ci \
    && npm install -g npm@12

COPY prisma ./prisma
COPY prisma.config.ts ./

RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" \
    npx prisma generate


# Stage 2: Production
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN apk update \
    && apk upgrade --no-cache \
    && npm ci --omit=dev \
    && rm -rf /usr/local/lib/node_modules/npm \
              /usr/local/bin/npm \
              /usr/local/bin/npx

COPY --from=dependencies /app/generated ./generated
COPY src ./src

USER node

EXPOSE 5000

CMD ["node", "src/server.js"]


# Stage 3: Migration
FROM dependencies AS migration

RUN rm -rf /usr/local/lib/node_modules/npm \
           /usr/local/bin/npm \
           /usr/local/bin/npx

USER node

CMD ["node", "/app/node_modules/prisma/build/index.js", "migrate", "deploy"]
