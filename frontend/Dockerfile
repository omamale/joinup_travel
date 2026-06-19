# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-workspace.yaml ./
COPY packages/ ./packages/
COPY apps/web/package.json ./apps/web/

RUN pnpm install --frozen-lockfile

COPY apps/web/ ./apps/web/
COPY .env.example ./apps/web/.env.local

RUN pnpm --filter web build

# Production stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/apps/web/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
