# Build do backend
FROM node:20-alpine AS build-backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install
COPY backend/src ./

# Build do frontend
FROM node:20-alpine AS build-frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

#Build final
FROM node:20-alpine AS build-final
WORKDIR /app
COPY --from=build-backend /app/backend /app
COPY --from=build-frontend /app/frontend/dist /app/dist
WORKDIR /app
RUN npm install --only=production

CMD ["node", "/app/index.js"]