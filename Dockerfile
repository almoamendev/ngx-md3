# ─────────────────────────────────────────────
#  Angular — md3 (Dev)
# ─────────────────────────────────────────────
FROM node:24-alpine

# Chromium for `ng test`. karma-chrome-launcher finds it through CHROME_BIN.
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont
ENV CHROME_BIN=/usr/bin/chromium-browser

WORKDIR /md3
ENV PATH="/md3/node_modules/.bin:${PATH}"
RUN ln -s /md3/node_modules/.bin/ng /usr/local/bin/ng

COPY package*.json ./
RUN npm install

COPY . .

# No default CMD — each project is started via docker-compose
EXPOSE 4200
