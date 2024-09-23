package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/eu-micaeu/API-GerenciamentoDeUsuarios-GoLang/handlers"
)

// FUnção com finalidade de criar as rotas de usuário
func MealRoutes(r *gin.Engine, db *sql.DB) {
	
	mealHandler := handlers.Meal{}

	r.POST("/createMeal", mealHandler.CriarRefeicao(db))

	r.GET("/listMenuMeals/:menu_id", mealHandler.ListarRefeicoesDeUmMenu(db))

}
