FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run css:build

FROM node:22-alpine AS production

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/views ./views
COPY --from=builder /app/public ./public
COPY --from=builder /app/routes ./routes
COPY --from=builder /app/services ./services
COPY --from=builder /app/repositories ./repositories
COPY --from=builder /app/models ./models
COPY --from=builder /app/middleware ./middleware
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/db/migrations ./db/migrations
COPY --from=builder /app/config.js ./config.js
COPY --from=builder /app/knexfile.js ./knexfile.js
COPY --from=builder /app/server.js ./server.js

EXPOSE 3000

CMD ["sh", "-c", "node_modules/.bin/knex migrate:latest --knexfile ./knexfile.js && node server.js"]
