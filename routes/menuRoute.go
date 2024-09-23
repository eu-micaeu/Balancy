package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/eu-micaeu/API-GerenciamentoDeUsuarios-GoLang/handlers"
)

// Função para criar as rotas de menu
func MenuRoutes(r *gin.Engine, db *sql.DB) {
	
	menuHandler := handlers.Menu{}

	r.POST("/createMenu", menuHandler.CriarMenu(db))

	r.GET("/listUserMenus", menuHandler.ListarMenusDeUmUsuario(db))

	r.GET("/menu/:menu_id", menuHandler.CarregarMenu(db))

	r.GET("/calculateMenuCaloriesAndQuantity/:menu_id", menuHandler.CalcularTotalDeCaloriasEQuantidadeDoMenu(db))

}
