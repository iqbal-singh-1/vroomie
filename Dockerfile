# Stage 1: Build frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Stage 2: Backend setup
FROM node:20-alpine

WORKDIR /app

# Copy backend files
COPY server ./server

# Copy frontend build
COPY --from=frontend-builder /app/dist ./dist

# Copy package files
COPY package*.json ./

RUN npm install --production

EXPOSE 5000

CMD ["node", "server/index.js"]
