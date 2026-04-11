# Build front (ex. Vite/React)
FROM node:20-bullseye AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Runtime: sert la SPA via Express (Cloud Run écoute $PORT)
FROM node:20-bullseye
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/package*.json ./
RUN npm i --omit=dev express
COPY server.cjs ./server.cjs
EXPOSE 8080
CMD ["node", "server.cjs"]
