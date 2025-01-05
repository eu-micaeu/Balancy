package routes

import (
	"database/sql"

	"github.com/eu-micaeu/Balancy/server/handlers"
	"github.com/eu-micaeu/Balancy/server/middlewares"
	"github.com/gin-gonic/gin"
)

// Função para criar as rotas de usuário
func FoodRoutes(r *gin.Engine, db *sql.DB) {

	foodHandler := handlers.Food{}

	r.POST("/createFood", middlewares.AuthMiddleware(), foodHandler.Create(db))

	r.DELETE("/deleteFood/:food_id", middlewares.AuthMiddleware(), foodHandler.Delete(db))

}
