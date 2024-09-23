package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/eu-micaeu/API-GerenciamentoDeUsuarios-GoLang/handlers"
)

// FUnção com finalidade de criar as rotas de usuário
func MenuRoutes(r *gin.Engine, db *sql.DB) {
	
	menuHandler := handlers.Menu{}

	r.POST("/createMenu", menuHandler.CriarMenu(db))

	r.GET("/listUserMenus", menuHandler.ListarMenusDeUmUsuario(db))

	r.GET("/menu/:menu_id", menuHandler.CarregarMenu(db))

}
