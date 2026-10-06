# Multi-stage Dockerfile para EduVanguard (Node.js + PHP CLI para execução do instalador)
FROM node:20-bookworm-slim

# Instalar PHP CLI, extensões de banco MySQL e ferramentas essenciais
RUN apt-get update && apt-get install -y --no-install-recommends \
    php-cli \
    php-mysql \
    php-curl \
    php-json \
    php-mbstring \
    curl \
    unzip \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências Node
RUN npm ci

# Copiar todo o projeto para o contêiner
COPY . .

# Compilar assets frontend com Vite
RUN npm run build

# Expor a porta 3000 do servidor Express
EXPOSE 3000

# Executar com tsx server.ts
CMD ["npm", "run", "start"]
