# ==============================================================================
# TEMPERATURE CONVERSION SYSTEM - PRODUCTION DOCKERFILE
# Milestone 5: Deployment, Packaging & Production Readiness
# Multi-stage lightweight Node.js 24 Alpine container (with built-in node:sqlite)
# ==============================================================================

# ---- Stage 1: Dependencies ----
FROM node:24-alpine AS dependencies
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# ---- Stage 2: Final Production Runtime ----
FROM node:24-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

# Install curl for automated healthcheck probing
RUN apk add --no-cache curl

# Create non-root system user for security isolation
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy dependencies and application source
COPY --from=dependencies /app/node_modules ./node_modules
COPY --chown=appuser:appgroup package.json ./
COPY --chown=appuser:appgroup server ./server
COPY --chown=appuser:appgroup client ./client

# Create persistent database directory and grant permissions
RUN mkdir -p /app/server/data && chown -R appuser:appgroup /app/server/data

USER appuser

# Expose standard production port
EXPOSE 3000

# Health check probe against /api/health
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Launch production server
CMD ["node", "server/server.js"]
