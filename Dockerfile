FROM node:18

RUN curl -fsSL https://get.pnpm.io/install.sh | bash -
ENV PATH="/root/.local/share/pnpm:$PATH"

WORKDIR /dbassignment

COPY pnpm-lock.yaml ./
RUN pnpm fetch

COPY . ./
RUN pnpm install --offline --unsafe-perm && \
  pnpm -r run build

CMD [ "pnpm", "start" ]
