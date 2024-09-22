package routes

import (
	"database/sql"

	"github.com/gin-gonic/gin"
	"github.com/eu-micaeu/API-GerenciamentoDeUsuarios-GoLang/handlers"
)

// FUnção com finalidade de criar as rotas de usuário
func UserRoutes(r *gin.Engine, db *sql.DB) {
	
	userHandler := handlers.User{}

	r.POST("/login", userHandler.Entrar(db))

	r.POST("/register", userHandler.Registrar(db))

	r.DELETE("/delete", userHandler.Deletar(db))

}
