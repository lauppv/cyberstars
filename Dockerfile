FROM node:24-alpine
WORKDIR /app

RUN apk add --no-cache docker-cli

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

# It's run separately, not as postinstall, to take advantage of docker caching
COPY prisma ./prisma 
RUN npx prisma generate

COPY . .
RUN npm run build

EXPOSE 8080
CMD ["sh", "-c", "npx prisma migrate deploy && npx tsx prisma/seed.ts && npx tsx server/server.ts"]
