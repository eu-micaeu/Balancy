package main

import (
    "github.com/gin-gonic/gin"
    "github.com/eu-micaeu/Balancy/server/database"
    "github.com/eu-micaeu/Balancy/server/middlewares"
    "github.com/eu-micaeu/Balancy/server/routes"
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

    // Inicia o servidor
    err = r.Run()
    if err != nil {
        panic(err)
    }
}
