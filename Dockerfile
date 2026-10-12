FROM node:24-alpine
WORKDIR /app

RUN apk add --no-cache docker-cli

COPY package.json package-lock.json ./
# Every workspace's manifest has to be here too: without it npm ci still
# succeeds, but leaves the package out and the build fails much later
COPY apps/ui/package.json ./apps/ui/
COPY packages/content/package.json ./packages/content/
COPY packages/shared/package.json ./packages/shared/
RUN npm ci --ignore-scripts

# It's run separately, not as postinstall, to take advantage of docker caching
COPY prisma ./prisma 
RUN npx prisma generate

COPY . .
RUN npm run build

EXPOSE 8080
CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx prisma/seed.ts && npx tsx server/server.ts"]
