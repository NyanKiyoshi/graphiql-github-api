FROM node:24-slim AS PNPM
RUN npm install -g 'pnpm@10' && pnpm -v

FROM PNPM AS DEPS
WORKDIR /app
ADD ./package.json ./pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM PNPM AS VITE_BUILD
WORKDIR /app
ADD ./package.json ./
ADD ./index.html ./
ADD ./public ./public/
ADD ./src ./src/
ADD ./vite.config.mjs ./
COPY --from=DEPS /app/node_modules/ ./node_modules/
RUN pnpm run build

EXPOSE 4174
CMD ["pnpm", "start"]
