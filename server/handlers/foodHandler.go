package handlers

import (
	"database/sql"
	"fmt"
	"github.com/eu-micaeu/Balancy/server/models"
	"github.com/gin-gonic/gin"
)

type Food models.Food

// Create
func (f *Food) Create(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Recupera o userId do contexto (extraído do token JWT)
		userID, exists := c.Get("userID")
		if !exists {
			c.JSON(401, gin.H{"error": "User not authorized"})
			return
		}

		// Faz o bind dos dados do corpo da requisição para o struct Food
		if err := c.ShouldBindJSON(&f); err != nil {
			c.JSON(400, gin.H{"error": "Invalid request body"})
			return
		}

		// Valida se o meal_id pertence ao menu do usuário autenticado
		queryValidateMeal := `
			SELECT meal_id 
			FROM meals
			JOIN menus ON menus.menu_id = meals.menu_id
			WHERE menus.user_id = $1 AND meals.meal_id = $2
		`
		var mealID int
		err := db.QueryRow(queryValidateMeal, userID, f.MealId).Scan(&mealID)
		if err != nil {
			c.JSON(404, gin.H{"error": "Meal not found or unauthorized"})
			return
		}

		// Insere os dados da comida na tabela foods
		queryInsert := `
			INSERT INTO foods (meal_id, food_name, calories, quantity) 
			VALUES ($1, $2, $3, $4)
		`
		_, err = db.Exec(queryInsert, mealID, f.FoodName, f.Calories, f.Quantity)
		if err != nil {
			c.JSON(500, gin.H{"error": "Failed to create food entry"})
			return
		}

		// Retorna uma mensagem de sucesso
		c.JSON(201, gin.H{"message": "Food entry created successfully"})
	}
}

// Read
func (f *Food) Read(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Recupera o userId do contexto
		userID, exists := c.Get("userID")
		if !exists {
			c.JSON(401, gin.H{"error": "User not authorized"})
			return
		}

		// Prepara a query para buscar os alimentos associados ao usuário autenticado
		query := `
			SELECT 
				foods.food_id, 
				foods.meal_id, 
				foods.food_name, 
				foods.calories, 
				foods.quantity 
			FROM foods
			JOIN meals ON foods.meal_id = meals.meal_id
			JOIN menus ON meals.menu_id = menus.menu_id
			WHERE menus.user_id = $1
		`

		// Executa a query
		rows, err := db.Query(query, userID)
		if err != nil {
			c.JSON(500, gin.H{"error": "Failed to retrieve food entries"})
			fmt.Println("Erro ao executar query:", err) // Log para depuração
			return
		}
		defer rows.Close()

		// Define uma lista para armazenar os resultados
		var foods []Food
		for rows.Next() {
			var food Food
			// Verifica e armazena os dados retornados
			if err := rows.Scan(&food.FoodId, &food.MealId, &food.FoodName, &food.Calories, &food.Quantity); err != nil {
				c.JSON(500, gin.H{"error": "Failed to parse food entries"})
				fmt.Println("Erro ao fazer scan das rows:", err) // Log para depuração
				return
			}
			foods = append(foods, food)
		}

		// Verifica se houve erros durante a iteração das linhas
		if err := rows.Err(); err != nil {
			c.JSON(500, gin.H{"error": "Failed during food entries iteration"})
			fmt.Println("Erro ao iterar rows:", err) // Log para depuração
			return
		}

		// Retorna os alimentos encontrados
		c.JSON(200, gin.H{
			"foods": foods,
		})
	}
}
