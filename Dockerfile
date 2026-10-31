FROM node:24-alpine
WORKDIR /app

RUN apk add --no-cache docker-cli

COPY package.json package-lock.json ./
# Every workspace's manifest has to be here too: without it npm ci still
# succeeds, but leaves the package out and the build fails much later
COPY apps/api/package.json ./apps/api/
COPY apps/ui/package.json ./apps/ui/
COPY packages/content/package.json ./packages/content/
COPY packages/shared/package.json ./packages/shared/
COPY framework/server-kit/package.json ./framework/server-kit/
COPY framework/sandbox/package.json ./framework/sandbox/
RUN npm ci --ignore-scripts

# It's run separately, not as postinstall, to take advantage of docker caching
COPY apps/api/prisma ./apps/api/prisma
COPY apps/api/prisma.config.ts ./apps/api/
COPY apps/api/src/config/paths.ts ./apps/api/src/config/
RUN npm run db:generate

COPY . .
RUN npm run build

EXPOSE 8080
CMD ["sh", "-c", "cd apps/api && npx prisma migrate deploy && npx tsx prisma/seed.ts && npx tsx src/server.ts"]
