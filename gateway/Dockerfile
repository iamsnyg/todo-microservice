# ==========================================
# Stage 1: Production Dependencies
# ==========================================
FROM node:22-alpine AS dependencies

WORKDIR /app

# Upgrade npm so dependency installation uses
# a version containing tar >= 7.5.19.
RUN npm install -g npm@12.0.2

COPY package.json package-lock.json ./

RUN npm ci --omit=dev \
    && npm cache clean --force


# ==========================================
# Stage 2: Production
# ==========================================
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Remove npm from the runtime image.
# The application starts directly with Node.js,
# so npm is not required at runtime.
RUN rm -rf /usr/local/lib/node_modules/npm \
    /usr/local/bin/npm \
    /usr/local/bin/npx

COPY --from=dependencies /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY src ./src

USER node

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD node -e "fetch('http://127.0.0.1:8000/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "src/server.js"]
