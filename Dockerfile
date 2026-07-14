FROM node:22-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .pnpmrc ./

RUN corepack enable
RUN corepack prepare pnpm@11.11.0 --activate

RUN pnpm install --frozen-lockfile --config.strict-dep-builds=false

COPY . .

RUN pnpm run build

EXPOSE 4000

CMD ["pnpm", "start"]