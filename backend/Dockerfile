# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy workspace files
COPY package.json pnpm-workspace.yaml ./
COPY packages/ ./packages/
COPY apps/backend/package.json ./apps/backend/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source
COPY apps/backend/ ./apps/backend/

# Generate Prisma client
RUN pnpm --filter backend prisma generate

# Build
RUN pnpm --filter backend build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml ./
COPY packages/ ./packages/
COPY apps/backend/package.json ./apps/backend/
COPY apps/backend/prisma/ ./apps/backend/prisma/

RUN pnpm install --frozen-lockfile --prod

COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/node_modules/.prisma ./apps/backend/node_modules/.prisma

WORKDIR /app/apps/backend

EXPOSE 4000

CMD ["node", "dist/main"]
