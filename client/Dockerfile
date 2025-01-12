# Use uma imagem base para Node.js
FROM node:18-alpine AS build

# Define o diretório de trabalho
WORKDIR /src

# Copia os arquivos de dependências e instala as dependências
COPY package*.json ./
RUN npm install

# Copia o restante dos arquivos e cria a build do React
COPY . .
RUN npm run build

# Fase final para servir a aplicação usando nginx
FROM nginx:alpine
COPY --from=build /src/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
