FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE $PORT
CMD ["sh", "-c", "npx prisma migrate deploy && node_modules/.bin/next start -p ${PORT:-3000}"]
