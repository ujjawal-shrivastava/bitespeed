# stage 1
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run prisma:generate
RUN npm run lint && npm run build
RUN ls -a ./dist

# stage 2
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./
COPY ./prisma /app/prisma
RUN npm run prisma:generate
EXPOSE 8000
CMD ["node","./index.js"]