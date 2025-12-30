FROM node:24-slim AS pnpm
RUN npm install -g 'pnpm@10' && pnpm -v

FROM pnpm AS deps
WORKDIR /app
ADD ./package.json ./pnpm-lock.yaml ./
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
