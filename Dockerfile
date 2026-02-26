FROM node:20-alpine

RUN apk add --no-cache bash

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY gatsby-config.js gatsby-node.js languages-metadata.yml ./
COPY scripts/ ./scripts/
COPY src/ ./src/
COPY static/ ./static/

RUN mkdir -p /app/src/content/languages /app/src/content/pages && \
    chmod +x /app/scripts/entrypoint.sh

ENTRYPOINT ["/app/scripts/entrypoint.sh"]
