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
