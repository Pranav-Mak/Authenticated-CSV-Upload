# ---- Build ----
    FROM node:20-alpine AS build
    WORKDIR /app
    COPY package*.json ./
    RUN npm ci
    COPY tsconfig.json ./
    COPY prisma ./prisma
    COPY public ./public
    COPY src ./src
    RUN npx prisma generate
    RUN npm run build
    
    # ---- Runtime ----
    FROM node:20-alpine
    WORKDIR /app
    ENV NODE_ENV=production
    RUN addgroup -S app && adduser -S app -G app
    COPY --from=build /app/node_modules ./node_modules
    COPY --from=build /app/dist ./dist
    COPY --from=build /app/prisma ./prisma
    RUN chown -R app:app ./prisma
    COPY --from=build /app/public ./public
    COPY package*.json ./
    RUN mkdir -p /uploads && chown -R app:app /uploads
    USER app
    EXPOSE 8080
    CMD ["sh", "-lc", "npx prisma migrate deploy && node dist/src/index.js"]
    