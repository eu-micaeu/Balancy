package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/eu-micaeu/kCal0/server/handlers"
)

// Função para criar as rotas de usuário
func UserRoutes(r *gin.Engine, db *sql.DB) {
	
	userHandler := handlers.User{}

	r.POST("/login", userHandler.Entrar(db))

	r.POST("/register", userHandler.Registrar(db))

	r.GET("/getUser", userHandler.Resgatar(db))

	r.DELETE("/delete", userHandler.Deletar(db))

	r.POST(("/calculateIMC"), userHandler.CalcularIMC(db))
	
	r.POST(("/calculateTDEE"), userHandler.CalcularTDEE(db))

}
