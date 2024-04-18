ARG NODE_VERSION=20.8.1

# ---- Base Node ----
FROM node:${NODE_VERSION}-bullseye-slim AS base

WORKDIR /usr/src/app

COPY package*.json ./

COPY prisma ./prisma/

RUN npm install

COPY . .

COPY public ./public

# ---- Build ----
FROM base AS build

RUN npm run build

# ---- Production ----
FROM node:${NODE_VERSION}-bullseye-slim AS production

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/dist ./dist

COPY --from=build /usr/src/app/prisma ./prisma

COPY --from=build /usr/src/app/public ./public

COPY ecosystem.config.js ./

COPY package*.json ./

RUN npm install --package-lock-only

RUN npm ci --only=production

RUN npm install pm2 -g

USER node

CMD ["sh", "-c", "npm run migrate:deploy && pm2-runtime start ecosystem.config.js"]
