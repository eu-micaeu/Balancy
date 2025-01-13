# Etapa 1: Construção da aplicação React (Node.js)
FROM node:18-alpine AS build

# Define o diretório de trabalho para o Node.js
WORKDIR /app

# Copia os arquivos de dependências e instala as dependências
COPY client/package*.json ./
RUN npm install

# Copia o restante dos arquivos e cria a build do React
COPY client . 
RUN npm run build

# Etapa 2: Construção da aplicação Go
FROM golang:1.23.4-alpine3.21 AS go-build

# Define o diretório de trabalho para o Go
WORKDIR /app

# Copia os arquivos necessários para o Go Modules
COPY server/go.mod server/go.sum ./

# Baixa as dependências do módulo
RUN go mod tidy

# Copia o restante dos arquivos do código Go
COPY server . 

# Compila o código Go
RUN go build -o main .

# Etapa final: Configuração do nginx com o React e execução do Go
FROM nginx:alpine

# Copia os arquivos de build do React para o nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copia o binário compilado do Go para a imagem final
COPY --from=go-build /app/main /usr/local/bin/main

# Expõe as portas para o React e o Go
EXPOSE 80
EXPOSE 8080

# Inicia o nginx para servir o React e o servidor Go
CMD ["sh", "-c", "nginx -g 'daemon off;' & /usr/local/bin/main"]
