package handlers

import (
	"database/sql"
	"net/http"

	"github.com/eu-micaeu/Balancy/server/models"
	"github.com/gin-gonic/gin"
)

type Meal models.Meal

// Create
func (m *Meal) Create(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {

		userID, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
			return
		}

		// Obter dados do corpo da requisição (JSON)
		var meal models.Meal
		if err := c.ShouldBindJSON(&meal); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload", "details": err.Error()})
			return
		}

		// Validar campos obrigatórios em meal
		if meal.MealName == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "meal_name is required"})
			return
		}

		// Recuperar menu_id com base no user_id (operação associada ao menu do usuário)
		var menuID int
		queryGetMenuID := `SELECT menu_id FROM menus WHERE user_id = $1 LIMIT 1`
		err := db.QueryRow(queryGetMenuID, userID).Scan(&menuID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve menu_id for user", "details": err.Error()})
			return
		}

		// Inserir a refeição no banco de dados
		queryInsertMeal := `INSERT INTO meals (meal_name, menu_id) VALUES ($1, $2)`
		_, err = db.Exec(queryInsertMeal, meal.MealName, menuID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert meal", "details": err.Error()})
			return
		}

		// Retornar resposta de sucesso
		c.JSON(http.StatusOK, gin.H{
			"message":   "Meal created successfully",
			"meal_name": meal.MealName,
		})
	}
}

// Delete

// Delete
func (m *Meal) Delete(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {

		userID, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
			return
		}

		// Obter meal_id do parâmetro da URL
		mealID := c.Param("meal_id")
		if mealID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "meal_id is required"})
			return
		}

		// Validar se a refeição pertence ao usuário
		var menuID int
		queryValidateMeal := `SELECT m.menu_id FROM meals AS m
							  JOIN menus AS mn ON m.menu_id = mn.menu_id
							  WHERE m.meal_id = $1 AND mn.user_id = $2 LIMIT 1`
		err := db.QueryRow(queryValidateMeal, mealID, userID).Scan(&menuID)
		if err != nil {
			if err == sql.ErrNoRows {
				c.JSON(http.StatusNotFound, gin.H{"error": "Meal not found or does not belong to user"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to validate meal", "details": err.Error()})
			return
		}

		// Deletar a refeição do banco de dados
		queryDeleteMeal := `DELETE FROM meals WHERE meal_id = $1`
		_, err = db.Exec(queryDeleteMeal, mealID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete meal", "details": err.Error()})
			return
		}

		// Retornar resposta de sucesso
		c.JSON(http.StatusOK, gin.H{"message": "Meal deleted successfully"})
	}
}

// Read - busca uma refeição específica com seus alimentos e total de calorias
func (m *Meal) Read(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		userID, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
			return
		}

		mealID := c.Param("meal_id")
		if mealID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "meal_id is required"})
			return
		}

		// Validar se a refeição pertence ao usuário e buscar dados da refeição
		type MealResponse struct {
			MealId        int           `json:"meal_id"`
			MealName      string        `json:"meal_name"`
			Foods         []models.Food `json:"foods"`
			TotalCalories float64       `json:"total_calories"`
		}

		var meal MealResponse
		queryValidateAndGet := `SELECT m.meal_id, m.meal_name FROM meals AS m
								JOIN menus AS mn ON m.menu_id = mn.menu_id
								WHERE m.meal_id = $1 AND mn.user_id = $2 LIMIT 1`
		err := db.QueryRow(queryValidateAndGet, mealID, userID).Scan(&meal.MealId, &meal.MealName)
		if err != nil {
			if err == sql.ErrNoRows {
				c.JSON(http.StatusNotFound, gin.H{"error": "Meal not found or does not belong to user"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to validate meal", "details": err.Error()})
			return
		}

		// Buscar alimentos da refeição
		queryFoods := "SELECT food_id, food_name, quantity, calories FROM foods WHERE meal_id = $1"
		rowsFoods, err := db.Query(queryFoods, meal.MealId)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get foods", "details": err.Error()})
			return
		}
		defer rowsFoods.Close()

		var foods []models.Food
		var totalCalories float64 = 0
		for rowsFoods.Next() {
			var food models.Food
			err := rowsFoods.Scan(&food.FoodId, &food.FoodName, &food.Quantity, &food.Calories)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to process foods", "details": err.Error()})
				return
			}
			// Somar as calorias do alimento ao total da refeição
			totalCalories += float64(food.Calories * food.Quantity)
			foods = append(foods, food)
		}

		meal.Foods = foods
		meal.TotalCalories = totalCalories

		c.JSON(http.StatusOK, gin.H{
			"meal": meal,
		})
	}
}

// Update - atualiza o nome da refeição
func (m *Meal) Update(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {

		userID, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
			return
		}

		mealID := c.Param("meal_id")
		if mealID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "meal_id is required"})
			return
		}

		var payload struct {
			MealName string `json:"meal_name"`
		}
		if err := c.ShouldBindJSON(&payload); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload", "details": err.Error()})
			return
		}

		if payload.MealName == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "meal_name is required"})
			return
		}

		// Validar se a refeição pertence ao usuário
		var menuID int
		queryValidateMeal := `SELECT m.menu_id FROM meals AS m
							  JOIN menus AS mn ON m.menu_id = mn.menu_id
							  WHERE m.meal_id = $1 AND mn.user_id = $2 LIMIT 1`
		err := db.QueryRow(queryValidateMeal, mealID, userID).Scan(&menuID)
		if err != nil {
			if err == sql.ErrNoRows {
				c.JSON(http.StatusNotFound, gin.H{"error": "Meal not found or does not belong to user"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to validate meal", "details": err.Error()})
			return
		}

		queryUpdate := `UPDATE meals SET meal_name = $1 WHERE meal_id = $2`
		_, err = db.Exec(queryUpdate, payload.MealName, mealID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update meal", "details": err.Error()})
			return
		}

		c.JSON(http.StatusOK, gin.H{"message": "Meal updated successfully", "meal_name": payload.MealName})
	}
}
