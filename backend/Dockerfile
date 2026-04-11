FROM node:24-alpine AS base
WORKDIR /app

RUN apk add --no-cache bash curl ca-certificates openssl libc6-compat

ENV BUN_INSTALL=/root/.bun
ENV PATH=/root/.bun/bin:$PATH
RUN curl -fsSL https://bun.sh/install | bash

ENV PRISMA_CLI_QUERY_ENGINE_TYPE=binary

FROM base AS deps
COPY package.json bun.lock tsconfig.json tsconfig.build.json nest-cli.json eslint.config.mjs prisma.config.ts ./
COPY prisma ./prisma
RUN bun install --frozen-lockfile

FROM deps AS build
COPY src ./src
COPY test ./test
RUN bunx prisma generate
RUN bun run build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV BUN_INSTALL=/root/.bun
ENV PATH=/root/.bun/bin:$PATH
RUN apk add --no-cache bash curl ca-certificates openssl libc6-compat
RUN curl -fsSL https://bun.sh/install | bash
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/bun.lock ./bun.lock
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./prisma.config.ts
EXPOSE 3000
CMD ["bun", "run", "start:prod"]
