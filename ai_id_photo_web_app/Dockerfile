# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.18.0
FROM node:${NODE_VERSION}-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source
COPY . .

# Build-time API base URL for Next.js (public env)
ARG NEXT_PUBLIC_REACT_APP_BASE_API_URL=http://localhost:4000
ENV NEXT_PUBLIC_REACT_APP_BASE_API_URL=$NEXT_PUBLIC_REACT_APP_BASE_API_URL

# Build Next.js app
RUN npm run build

FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy built assets and node_modules from builder
COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY --from=build /app/next.config.mjs ./next.config.mjs 2>/dev/null || true

EXPOSE 3000
CMD ["npm", "run", "start"]
