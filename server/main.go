package main

import (

	"github.com/gin-gonic/gin"

	"github.com/eu-micaeu/kCal0/database"

	"github.com/eu-micaeu/kCal0/middlewares"

	"github.com/eu-micaeu/kCal0/routes"

)

func main() {

	r := gin.Default() // Creates a gin route handle

	r.Use(middlewares.CorsMiddleware())        // Middleware CORS

    r.Use(middlewares.CacheCleanerMiddleware()) // Middleware de limpeza de cache

	db, err := database.NewDB() // Connects to the database

	if err != nil { // If there is an error connecting to the database, the program will stop

		panic(err) 

	}

	routes.UserRoutes(r, db) // Calls the UserRoutes function and passes the route handle and the database connection

	routes.MenuRoutes(r, db) // Calls the MenuRoutes function and passes the route handle and the database connection

	routes.MealRoutes(r, db) // Calls the MealRoutes function and passes the route handle and the database connection

	routes.FoodRoutes(r, db) // Calls the FoodRoutes function and passes the route handle and the database connection

	r.Run() // Run the server

}