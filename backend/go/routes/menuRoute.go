package routes

import (
	"database/sql"

	"github.com/eu-micaeu/Balancy/server/handlers"
	"github.com/eu-micaeu/Balancy/server/middlewares"
	"github.com/gin-gonic/gin"
)

// Função para criar as rotas de usuário
func MenuRoutes(r *gin.Engine, db *sql.DB) {

	menuHandler := handlers.Menu{}

	r.POST("/createMenu", middlewares.AuthMiddleware(), menuHandler.Create(db))

	r.GET("/readMenu", middlewares.AuthMiddleware(), menuHandler.Read(db))

}
