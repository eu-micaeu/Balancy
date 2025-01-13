package main

import (
	"github.com/gin-gonic/gin"

	"github.com/eu-micaeu/Balancy/server/database"
	"github.com/eu-micaeu/Balancy/server/middlewares"
	"github.com/eu-micaeu/Balancy/server/routes"
)

func main() {
	r := gin.Default() // Cria o servidor Gin

	// Middleware CORS
	r.Use(middlewares.CorsMiddleware())

	// Middleware de limpeza de cache
	r.Use(middlewares.CacheCleanerMiddleware())

	// Conecta ao banco de dados
	db, err := database.NewDB()
	if err != nil {
		panic(err)
	}

	// Define as rotas da aplicação
	routes.UserRoutes(r, db)
	routes.MenuRoutes(r, db)
	routes.MealRoutes(r, db)
	routes.FoodRoutes(r, db)

	// Rota para validação de token
	r.GET("/validateToken", middlewares.ValidarTokenHandler)

	// Serve arquivos estáticos do React (build)
	r.Static("/static", "./client/build/static")

	// Serve o index.html para rotas desconhecidas (SPA)
	r.NoRoute(func(c *gin.Context) {
		c.File("./client/build/index.html")
	})

	// Executa o servidor
	err = r.Run()
	if err != nil {
		panic(err)
	}
}
