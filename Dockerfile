FROM node:24-slim AS pnpm

WORKDIR /app

# Install PNPM
ADD ./package.json ./
RUN set -eux; \
  corepack enable; \
  corepack install; \
  pnpm -v

FROM pnpm AS deps
ADD ./pnpm-lock.yaml ./pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM pnpm AS vitebuild
WORKDIR /app
ADD ./package.json ./
ADD ./index.html ./
ADD ./src ./src/
ADD ./vite.config.mjs ./
COPY --from=deps /app/node_modules/ ./node_modules/
RUN pnpm run build

EXPOSE 4174
CMD ["pnpm", "start"]
