# Use uma imagem base para Go
FROM golang:1.23.4-alpine3.21

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos necessários para o Go Modules
COPY go.mod go.sum ./

# Baixa as dependências do módulo
RUN go mod tidy

# Copia o restante dos arquivos do código
COPY . .

# Compila o código
RUN go build -o main .

# Expõe a porta do servidor
EXPOSE 8080

# Define o comando padrão para rodar o servidor
CMD ["./main"]
