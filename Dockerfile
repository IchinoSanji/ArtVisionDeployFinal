FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Install ALL dependencies (including dev) for build
RUN npm ci

COPY . .

# Build the app
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --production

ENV NODE_ENV=production

EXPOSE 10000

CMD ["npm", "run", "start"]
