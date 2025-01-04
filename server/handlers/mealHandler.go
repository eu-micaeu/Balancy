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

// Read
func (m *Meal) Read(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {

		userID, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
			return
		}

		// Query para buscar os meals a partir do user_id
		query := `
			SELECT meal_id, meal_name, menu_id 
			FROM meals 
			WHERE menu_id IN (SELECT menu_id FROM menus WHERE user_id = $1)
		`
		rows, err := db.Query(query, userID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve meals", "details": err.Error()})
			return
		}
		defer rows.Close()

		// Parse the result into a slice of meals
		var meals []models.Meal
		for rows.Next() {
			var meal models.Meal
			if err := rows.Scan(&meal.MealId, &meal.MealName, &meal.MenuId); err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to parse meal data", "details": err.Error()})
				return
			}
			meals = append(meals, meal)
		}

		if err := rows.Err(); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error occurred during iteration", "details": err.Error()})
			return
		}

		// Retornar os meals em JSON
		c.JSON(http.StatusOK, gin.H{"meals": meals})
	}
}
