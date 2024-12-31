package middlewares

import (
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func ValidarToken(token string) (int, error) {
    if token == "" {
        return 0, errors.New("token não fornecido")
    }
    if token == "validToken" { 
        return 1, nil 
    }
    return 0, errors.New("token inválido")
}

func AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        authHeader := c.GetHeader("Authorization")
        if authHeader == "" {
            c.JSON(401, gin.H{"message": "Token não fornecido"})
            c.Abort()
            return
        }

        parts := strings.Split(authHeader, " ")
        if len(parts) != 2 || parts[0] != "Bearer" {
            c.JSON(401, gin.H{"message": "Formato do token inválido"})
            c.Abort()
            return
        }

        token := parts[1]

        userID, err := ValidarToken(token)
        if err != nil {
            c.JSON(401, gin.H{"message": err.Error()})
            c.Abort()
            return
        }

        c.Set("userID", userID)

        c.Next()
    }
}

func CorsMiddleware() gin.HandlerFunc {
    config := cors.DefaultConfig()

    config.AllowOrigins = []string{"*"} 

    config.AllowHeaders = append(config.AllowHeaders, "Authorization")

    return cors.New(config)
}

func CacheCleanerMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Header("Cache-Control", "no-cache, no-store, must-revalidate")
        c.Header("Pragma", "no-cache")
        c.Header("Expires", time.Unix(0, 0).Format(http.TimeFormat))

        c.Next()
    }
}
