# Etapa 1: Construcción de la aplicación
FROM public.ecr.aws/lambda/nodejs:20 AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm store clear
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# Etapa 2: Crear la imagen final
FROM public.ecr.aws/lambda/nodejs:20
WORKDIR /var/task
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install --prod
RUN pnpm store clear
COPY --from=builder /app/dist ./dist

CMD ["dist/server.handler"]