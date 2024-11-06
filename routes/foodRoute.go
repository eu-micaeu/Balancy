package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/eu-micaeu/kCal0/handlers"
)

// Função para criar as rotas de refeição
func FoodRoutes(r *gin.Engine, db *sql.DB) {
	
	foodHandler := handlers.Food{}

	r.POST("/createFood", foodHandler.CriarAlimento(db))

	r.GET("/listMealFoods/:meal_id", foodHandler.ListarAlimentosDeUmaRefeicao(db))

	r.GET("/listFood/:id", foodHandler.ListarAlimento(db))

	r.PUT("/updateFood/:food_id", foodHandler.AtualizarAlimento(db))

	r.DELETE("/deleteFood/:food_id", foodHandler.DeletarAlimento(db))

}
