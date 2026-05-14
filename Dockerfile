# ─────────────────────────────────────────────
#  Angular — md3 (Dev)
# ─────────────────────────────────────────────
FROM node:22-alpine

WORKDIR /md3

COPY package*.json ./
RUN npm install

COPY . .

# No default CMD — each project is started via docker-compose
EXPOSE 4200
