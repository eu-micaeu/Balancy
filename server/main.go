package main

import (
	"github.com/gin-gonic/gin"

	"github.com/eu-micaeu/Balancy/server/database"

	"github.com/eu-micaeu/Balancy/server/middlewares"

	"github.com/eu-micaeu/Balancy/server/routes"
)

func main() {

	r := gin.Default() // Creates a gin route handle

	r.Use(middlewares.CorsMiddleware()) // Middleware CORS

	r.Use(middlewares.CacheCleanerMiddleware()) // Middleware de limpeza de cache

	db, err := database.NewDB() // Connects to the database

	if err != nil { // If there is an error connecting to the database, the program will stop

		panic(err)

	}

	routes.UserRoutes(r, db)

	routes.MenuRoutes(r, db)

	routes.MealRoutes(r, db)

	routes.FoodRoutes(r, db)

	// Rota para validação de token
	r.GET("/validateToken", middlewares.ValidarTokenHandler)

	err = r.Run()

	if err != nil {

		return

	} // Run the server

}
