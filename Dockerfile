FROM node:18

RUN corepack enable && pnpm add -g pnpm

WORKDIR /dbassignment

COPY pnpm-lock.yaml ./
RUN pnpm fetch

COPY . ./
RUN pnpm install --offline --unsafe-perm && \
  pnpm build

CMD [ "pnpm", "start:prod" ]
