
# ==========================================
# Stage 1: Build
# ==========================================
FROM node:22-bookworm-slim AS builder

WORKDIR /app

# Copy dependency manifests first for better Docker layer caching
COPY package.json package-lock.json ./

# Install all dependencies required for build/Prisma generation
RUN npm ci

# Copy only files required for Prisma generation
COPY prisma ./prisma
COPY prisma.config.ts ./

# Prisma 7 requires DATABASE_URL while loading prisma.config.ts.
# This is ONLY a build-time dummy value.
# The real DATABASE_URL is provided at runtime.
RUN DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" \
    npx prisma generate

# Copy application source
COPY src ./src

# Remove development dependencies from the same node_modules tree.
# This avoids running npm ci a second time.
RUN npm prune --omit=dev


# ==========================================
# Stage 2: Production
# ==========================================
FROM node:22-bookworm-slim AS production

ENV NODE_ENV=production

WORKDIR /app

# Create dedicated non-root user
RUN groupadd --system --gid 1001 nodeapp \
    && useradd --system --uid 1001 --gid nodeapp nodeapp

# Copy only production dependencies
COPY --from=builder --chown=nodeapp:nodeapp /app/node_modules ./node_modules

# Copy generated Prisma Client
COPY --from=builder --chown=nodeapp:nodeapp /app/generated ./generated

# Copy Prisma schema, migrations, and config
COPY --from=builder --chown=nodeapp:nodeapp /app/prisma ./prisma
COPY --from=builder --chown=nodeapp:nodeapp /app/prisma.config.ts ./prisma.config.ts

# Copy application
COPY --from=builder --chown=nodeapp:nodeapp /app/src ./src

# package.json is useful for runtime metadata
COPY --from=builder --chown=nodeapp:nodeapp /app/package.json ./package.json

USER nodeapp

EXPOSE 5002

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:5002/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "src/server.js"]

