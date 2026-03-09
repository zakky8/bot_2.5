# ── Builder stage ─────────────────────────────────────────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app

# Build tools for native addons (canvas/sharp if needed)
RUN apk add --no-cache python3 make g++

# Install deps first (layer cache)
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ── Production stage ──────────────────────────────────────────────────────────
FROM node:18-alpine

WORKDIR /app

# Install production-only dependencies
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy compiled application
COPY --from=builder /app/dist ./dist

# Create logs directory
RUN mkdir -p /app/logs

# Run as non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

CMD ["node", "dist/index.js"]
