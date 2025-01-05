package routes

import (
	"database/sql"

	"github.com/eu-micaeu/Balancy/server/handlers"
	"github.com/eu-micaeu/Balancy/server/middlewares"
	"github.com/gin-gonic/gin"
)

// Função para criar as rotas de usuário
func MealRoutes(r *gin.Engine, db *sql.DB) {

	mealHandler := handlers.Meal{}

	r.POST("/createMeal", middlewares.AuthMiddleware(), mealHandler.Create(db))

}
