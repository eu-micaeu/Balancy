package main

import (
	"github.com/eu-micaeu/Balancy/server/database"
	"github.com/eu-micaeu/Balancy/server/middlewares"
	"github.com/eu-micaeu/Balancy/server/routes"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	// Middlewares
	r.Use(middlewares.CorsMiddleware())
	r.Use(middlewares.CacheCleanerMiddleware())

	// Conecta ao banco de dados
	db, err := database.NewDB()
	if err != nil {
		panic(err)
	}

	// Rotas do backend
	routes.UserRoutes(r, db)
	routes.MenuRoutes(r, db)
	routes.MealRoutes(r, db)
	routes.FoodRoutes(r, db)

	// Rota para validação de token
	r.GET("/validateToken", middlewares.ValidarTokenHandler)

	// Rota para servir todo o React (Front-End)
	r.StaticFile("/", "../client/build/index.html")
	r.Static("/static", "../client/build/static")

	// Logo
	r.StaticFile("/logoPrincipal.png", "../client/build/logoPrincipal.png")

	// Inicia o servidor
	err = r.Run()
	if err != nil {
		panic(err)
	}
}
