package main

import (
    "log"
    "net/http"
    "github.com/eu-micaeu/Balancy/server/database"
    "github.com/eu-micaeu/Balancy/server/middlewares"
    "github.com/eu-micaeu/Balancy/server/routes"
    "github.com/gin-gonic/gin"
    "github.com/joho/godotenv"
)

func init() {
    err := godotenv.Load("../.env")
    if err != nil {
        log.Fatalf("Erro ao carregar o arquivo .env: %v", err)
    }
}

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

    // Rota para servir o frontend React
    r.StaticFS("/app", http.Dir("./build"))

    // Rota para lidar com outras rotas que não existam (fallback para index.html)
    r.NoRoute(func(c *gin.Context) {
        c.File("./build/index.html")
    })

    // Inicia o servidor
    err = r.Run()
    if err != nil {
        panic(err)
    }
}
