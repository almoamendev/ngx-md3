# ─────────────────────────────────────────────
#  Angular — md3 (Dev)
# ─────────────────────────────────────────────
FROM node:22-alpine

WORKDIR /md3
ENV PATH="/md3/node_modules/.bin:${PATH}"
RUN ln -s /md3/node_modules/.bin/ng /usr/local/bin/ng

COPY package*.json ./
RUN npm install

COPY . .

# No default CMD — each project is started via docker-compose
EXPOSE 4200
