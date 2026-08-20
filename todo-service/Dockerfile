# ==========================================
# Stage 1: Dependencies + Prisma Client
# ==========================================

FROM node:22-alpine AS dependencies

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

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=dev

COPY --from=dependencies /app/generated ./generated

COPY src ./src

USER node

EXPOSE 5001

CMD ["npm", "start"]