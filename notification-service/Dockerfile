# ==========================================
# Stage 1: Dependencies + Prisma Client
# ==========================================

FROM node:22-bookworm-slim AS dependencies

WORKDIR /app

RUN npm install -g npm@12.0.2

COPY package.json package-lock.json ./

RUN npm ci

COPY prisma ./prisma
COPY prisma.config.ts ./

RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" \
    npx prisma generate


# ==========================================
# Stage 2: Production
# ==========================================

FROM node:22-bookworm-slim AS production

RUN npm install -g npm@12.0.2

ENV NODE_ENV=production

WORKDIR /app

RUN groupadd --system --gid 1001 nodeapp \
    && useradd --system --uid 1001 --gid nodeapp nodeapp

COPY --from=dependencies --chown=nodeapp:nodeapp /app/package.json ./package.json
COPY --from=dependencies --chown=nodeapp:nodeapp /app/node_modules ./node_modules
COPY --from=dependencies --chown=nodeapp:nodeapp /app/generated ./generated
COPY --from=dependencies --chown=nodeapp:nodeapp /app/prisma ./prisma
COPY --from=dependencies --chown=nodeapp:nodeapp /app/prisma.config.ts ./prisma.config.ts

COPY --chown=nodeapp:nodeapp src ./src

USER nodeapp

EXPOSE 5002

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:5002/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "src/server.js"]


# ==========================================
# Stage 3: Migration
# ==========================================

FROM dependencies AS migration

RUN rm -rf /usr/local/lib/node_modules/npm \
           /usr/local/bin/npm \
           /usr/local/bin/npx

USER 1001

CMD ["node", "/app/node_modules/prisma/build/index.js", "migrate", "deploy"]
