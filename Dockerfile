# Stage 1: Build
FROM node:22.16.0-alpine AS builder
WORKDIR /app
RUN apk update && apk upgrade --no-cache
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:22.16.0-alpine AS production
WORKDIR /app
RUN apk update && apk upgrade --no-cache
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app/.env ./
EXPOSE 3000
CMD ["npm", "run", "start:prod"] 