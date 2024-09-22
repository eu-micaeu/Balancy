package middlewares

import (
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
    "github.com/gin-contrib/cors"
)

// Função para adicionar o middleware de CORS
func CorsMiddleware() gin.HandlerFunc {
    config := cors.DefaultConfig()
    config.AllowOrigins = []string{"*"}
    return cors.New(config)
}

// Função para adicionar o middleware de limpeza de cache
func CacheCleanerMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Header("Cache-Control", "no-cache, no-store, must-revalidate")
        c.Header("Pragma", "no-cache")
        c.Header("Expires", time.Unix(0, 0).Format(http.TimeFormat))
        c.Next() // Continue para a próxima etapa do middleware
    }
}
