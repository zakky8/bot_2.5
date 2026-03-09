# Root Dockerfile — builds the shared library only.
# For running both bots together use docker-compose.yml which builds
# telegram-bot/Dockerfile and discord-bot/Dockerfile individually.

FROM node:18-alpine AS shared-builder

WORKDIR /shared

COPY shared/package.json shared/package-lock.json ./
RUN npm ci

COPY shared/ ./
RUN npm run build

# This image is used as a build artefact by docker-compose.
# It is not meant to be run directly.
CMD ["echo", "Use docker-compose up to start the full bot stack."]
