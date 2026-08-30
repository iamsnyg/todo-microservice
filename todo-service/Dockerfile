# ==========================================
# Stage 1: Dependencies + Prisma Client
# ==========================================

FROM node:22-alpine AS dependencies

RUN npm install -g npm@12.0.2

RUN apk update \
    && apk upgrade --no-cache \
    && apk add --no-cache \
        libcrypto3=3.5.8-r0 \
        libssl3=3.5.8-r0

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts ./

RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npx prisma generate


# ==========================================
# Stage 2: Production
# ==========================================

FROM node:22-alpine AS production

RUN npm install -g npm@12.0.2

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=dependencies /app/generated ./generated

COPY --from=dependencies /app/prisma ./prisma
COPY --from=dependencies /app/prisma.config.ts ./prisma.config.ts

COPY src ./src

USER 1000

EXPOSE 5001

CMD ["npm", "start"]
