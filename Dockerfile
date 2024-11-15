# Stage 1: Build Stage
FROM node:20.15.1-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm@9.4.0
RUN pnpm install

# Copy source files and build
COPY . .
RUN pnpm run build

# Stage 2: Production Stage
FROM node:20.15.1-alpine
WORKDIR /app

# Copy necessary files from the builder stage
COPY --from=builder /app/dist /app/dist
COPY --from=builder /app/public /app/public
COPY --from=builder /app/server.cjs /app/server.cjs
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/node_modules /app/node_modules

# Expose port for SSR
EXPOSE 3000

# Start Express server to handle SSR
CMD ["node", "server.cjs"]
