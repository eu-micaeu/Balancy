
################

# Etapa 1: Build do React
FROM node:18-alpine AS react-build

WORKDIR /app

# Copia os arquivos necessários para o build do React
COPY client/package*.json ./
RUN npm install
COPY client . 
RUN npm run build

# Etapa 2: Build do backend em Go
FROM golang:1.23.4-alpine3.21 AS go-build

WORKDIR /app

# Copia os arquivos necessários para o build do Go
COPY server/go.mod server/go.sum ./
RUN go mod tidy
COPY server . 

# Compila o servidor Go
RUN go build -o main .

# Etapa Final: Combinação de React e Go
FROM alpine:3.21

WORKDIR /app

# Copia os arquivos estáticos do React
COPY --from=react-build /app/build ./client/build

# Copia o binário do servidor Go
COPY --from=go-build /app/main .

# Define a porta exposta pelo servidor
EXPOSE 8080

# Comando para iniciar o servidor
CMD ["./main"]
