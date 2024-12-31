package middlewares

import (
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// Função para validar o token (você pode substituir pela sua implementação de validação real)
func ValidarToken(token string) (int, error) {
    if token == "" {
        return 0, errors.New("Token não fornecido")
    }
    // Simulação de validação do token e extração do userID
    if token == "validToken" { // Substitua por lógica de validação real
        return 1, nil // Retorna o userID como exemplo
    }
    return 0, errors.New("Token inválido")
}

// Middleware para autenticação
func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        // Obtém o token do cabeçalho Authorization
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            c.JSON(401, gin.H{"message": "Token não fornecido"})
            c.Abort()
            return
        }

        // Verifica se o formato do token está correto (Bearer <token>)
        parts := strings.Split(authHeader, " ")
        if len(parts) != 2 || parts[0] != "Bearer" {
            c.JSON(401, gin.H{"message": "Formato do token inválido"})
            c.Abort()
            return
        }

        token := parts[1]

        // Valida o token e obtém o userID
        userID, err := ValidarToken(token)
        if err != nil {
            c.JSON(401, gin.H{"message": err.Error()})
            c.Abort()
            return
        }

        // Armazena o userID no contexto para uso posterior
        c.Set("userID", userID)

        // Continua o processamento da requisição
        c.Next()
    }
}

// Função para adicionar o middleware de CORS
func CorsMiddleware() gin.HandlerFunc {
    config := cors.DefaultConfig()

    // Permite qualquer origem, você pode restringir a URLs específicas aqui
    config.AllowOrigins = []string{"*"} 

    return cors.New(config)
}

// Função para adicionar o middleware de limpeza de cache
func CacheCleanerMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Header("Cache-Control", "no-cache, no-store, must-revalidate")
        c.Header("Pragma", "no-cache")
        c.Header("Expires", time.Unix(0, 0).Format(http.TimeFormat))

        c.Next() // Continua para a próxima etapa do middleware
    }
}