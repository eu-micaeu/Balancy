package routes

import (
	"database/sql"

	"github.com/eu-micaeu/Balancy/server/handlers"
	"github.com/eu-micaeu/Balancy/server/middlewares"
	"github.com/gin-gonic/gin"
)

// Função para criar as rotas de usuário
func UserRoutes(r *gin.Engine, db *sql.DB) {

	userHandler := handlers.User{}

	r.POST("/register", userHandler.Register(db))

	r.POST("/login", userHandler.Login(db))

	r.PUT("/updateUser", middlewares.AuthMiddleware(), userHandler.Update(db))

}
