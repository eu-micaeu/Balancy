package middlewares

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt"
)

func CorsMiddleware() gin.HandlerFunc {
	config := cors.DefaultConfig()

	// Permitir origens específicas (alterar para domínios confiáveis em produção)
	config.AllowOrigins = []string{"*"}

	// Permitir métodos específicos
	config.AllowMethods = []string{"GET", "POST", "PUT", "DELETE"}

	// Permitir cabeçalhos específicos
	config.AllowHeaders = []string{"Authorization", "Content-Type", "Origin"}

	return cors.New(config)
}

func CacheCleanerMiddleware() gin.HandlerFunc { // Cache-Control

	return func(c *gin.Context) {

		c.Header("Cache-Control", "no-cache, no-store, must-revalidate")

		c.Header("Pragma", "no-cache")

		c.Header("Expires", time.Unix(0, 0).Format(http.TimeFormat))

		c.Next()

	}

}

// AuthMiddleware valida o token JWT presente no cabeçalho Authorization
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Extrair o cabeçalho Authorization
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
			c.Abort()
			return
		}

		// Verificar se o token está no formato "Bearer <token>"
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Authorization header format"})
			c.Abort()
			return
		}

		// Validar o token
		tokenStr := parts[1]
		claims, err := ValidarToken(tokenStr)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token", "details": err.Error()})
			c.Abort()
			return
		}

		// Adicionar as claims ao contexto
		c.Set("userID", claims["userID"])

		c.Next()
	}
}

// Chave secreta usada para assinar os tokens (mantenha-a segura)
var jwtSecret = []byte("sua-chave-secreta")

// GerarToken cria um JWT com o ID do usuário
func GerarToken(userID int) (string, error) {
	// Configurando as reivindicações do token
	claims := jwt.MapClaims{
		"userID": userID,
		"exp":    time.Now().Add(time.Hour * 5).Unix(), // Expiração: 5 minutos
		"iat":    time.Now().Unix(),
	}

	// Criando o token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	// Assinando o token com a chave secreta
	return token.SignedString(jwtSecret)
}

// ValidarToken verifica e decodifica um token JWT
func ValidarToken(tokenStr string) (jwt.MapClaims, error) {
	// Parse e valida o token
	token, err := jwt.Parse(tokenStr, func(token *jwt.Token) (interface{}, error) {
		// Validar o método de assinatura
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("método de assinatura inválido")
		}
		return jwtSecret, nil
	})

	if err != nil {
		return nil, err
	}

	// Recuperar as claims
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, fmt.Errorf("token inválido")
}

// ValidarTokenHandler verifica a validade de um token enviado no cabeçalho Authorization
func ValidarTokenHandler(c *gin.Context) {
	// Extrair o cabeçalho Authorization
	authHeader := c.GetHeader("Authorization")
	if authHeader == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Authorization header is required"})
		return
	}

	// Verificar se o token está no formato correto
	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Authorization header format"})
		return
	}

	tokenStr := parts[1]

	// Validar o token usando o middleware
	claims, err := ValidarToken(tokenStr)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token", "details": err.Error()})
		return
	}

	// Retornar sucesso com as informações do token
	c.JSON(http.StatusOK, gin.H{
		"message": "Token válido",
		"claims":  claims,
	})
}
