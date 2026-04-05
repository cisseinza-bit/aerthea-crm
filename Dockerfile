FROM node:20-alpine
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Generate Prisma client (no DB connection needed at build time)
RUN npx prisma generate

# Build Next.js (all routes are force-dynamic, no DB calls at build)
RUN npm run build

EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node_modules/.bin/next start -p ${PORT:-3000}"]
