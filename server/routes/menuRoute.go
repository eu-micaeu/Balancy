package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/eu-micaeu/kCal0/server/handlers"
	"github.com/eu-micaeu/kCal0/server/middlewares" 
)

func MenuRoutes(r *gin.Engine, db *sql.DB) {

	menuHandler := handlers.Menu{}

	r.POST("/createMenu", menuHandler.CriarMenu(db))

	r.GET("/menu/:menu_id", middlewares.AuthMiddleware(), menuHandler.LerMenu(db))

	r.GET("/calculateMenuCaloriesAndQuantity/:menu_id", middlewares.AuthMiddleware(), menuHandler.CalcularTotalDeCaloriasEQuantidadeDoMenu(db))

}
