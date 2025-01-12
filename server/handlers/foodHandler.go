package handlers

import (
	"database/sql"
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

// Delete
func (f *Food) Delete(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Recupera o userId do contexto (extraído do token JWT)
		userID, exists := c.Get("userID")
		if !exists {
			c.JSON(401, gin.H{"error": "User not authorized"})
			return
		}

		// Recupera o food_id do parâmetro da URL
		foodID := c.Param("food_id")

		// Valida se o food_id pertence ao usuário autenticado
		queryValidateFood := `
			SELECT foods.food_id 
			FROM foods
			JOIN meals ON meals.meal_id = foods.meal_id
			JOIN menus ON menus.menu_id = meals.menu_id
			WHERE menus.user_id = $1 AND foods.food_id = $2
		`
		var validFoodID int
		err := db.QueryRow(queryValidateFood, userID, foodID).Scan(&validFoodID)
		if err != nil {
			c.JSON(404, gin.H{"error": "Food not found or unauthorized"})
			return
		}

		// Deleta a comida da tabela foods
		queryDelete := `
			DELETE FROM foods
			WHERE food_id = $1
		`
		_, err = db.Exec(queryDelete, validFoodID)
		if err != nil {
			c.JSON(500, gin.H{"error": "Failed to delete food entry"})
			return
		}

		// Retorna uma mensagem de sucesso
		c.JSON(200, gin.H{"message": "Food entry deleted successfully"})
	}
}
