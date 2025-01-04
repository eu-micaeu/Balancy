package handlers

import (
	"database/sql"
	"github.com/eu-micaeu/Balancy/server/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Menu models.Menu

// Create
func (m *Menu) Create(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Recupere o userID do contexto
		userID, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
			return
		}

		var menu Menu

		// Faz o bind do JSON recebido (sem o campo UserId)
		if err := c.ShouldBindJSON(&menu); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Payload inválido: " + err.Error()})
			return
		}

		// Query com cláusula RETURNING para retornar o ID do menu criado
		query := "INSERT INTO menus (menu_name, user_id) VALUES ($1, $2) RETURNING menu_id"
		var id int
		err := db.QueryRow(query, menu.MenuName, userID).Scan(&id)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao inserir no banco de dados: " + err.Error()})
			return
		}

		// Adiciona o ID ao objeto Menu
		menu.MenuId = id

		c.JSON(http.StatusOK, gin.H{
			"message":   "Menu criado com sucesso!",
			"menu_name": menu.MenuName,
		})
	}
}

// Read
func (m *Menu) Read(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Recuperar o userID do contexto
		userID, exists := c.Get("userID")
		if !exists {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
			return
		}

		// Consultar o banco de dados para obter apenas um menu relacionado ao user_id
		queryMenu := "SELECT menu_id, menu_name FROM menus WHERE user_id = $1 LIMIT 1"
		var menu Menu
		err := db.QueryRow(queryMenu, userID).Scan(&menu.MenuId, &menu.MenuName)
		if err != nil {
			if err == sql.ErrNoRows {
				// Nenhum menu foi encontrado
				c.JSON(http.StatusNotFound, gin.H{"message": "Nenhum menu encontrado para o usuário autenticado"})
			} else {
				// Erro inesperado no banco de dados
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar o menu no banco de dados: " + err.Error()})
			}
			return
		}

		// Consultar as refeições (meals) relacionadas ao menu
		queryMeals := "SELECT meal_id, meal_name FROM meals WHERE menu_id = $1"
		rowsMeals, err := db.Query(queryMeals, menu.MenuId)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar as refeições no banco de dados: " + err.Error()})
			return
		}
		defer rowsMeals.Close()

		type Meal struct {
			MealId   int      `json:"meal_id"`
			MealName string   `json:"meal_name"`
			Foods    []string `json:"foods"`
		}

		var meals []Meal

		for rowsMeals.Next() {
			var meal Meal
			err := rowsMeals.Scan(&meal.MealId, &meal.MealName)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao processar as refeições: " + err.Error()})
				return
			}

			// Consultar os alimentos (foods) relacionados à refeição
			queryFoods := "SELECT food_name FROM foods WHERE meal_id = $1"
			rowsFoods, err := db.Query(queryFoods, meal.MealId)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar os alimentos no banco de dados: " + err.Error()})
				return
			}

			defer rowsFoods.Close()

			// Armazenar os alimentos em um slice
			var foods []string
			for rowsFoods.Next() {
				var foodName string
				err := rowsFoods.Scan(&foodName)
				if err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao processar os alimentos: " + err.Error()})
					return
				}
				foods = append(foods, foodName)
			}

			// Adicionar os alimentos à refeição
			meal.Foods = foods
			meals = append(meals, meal)
		}

		// Criar a resposta final
		c.JSON(http.StatusOK, gin.H{
			"menu": gin.H{
				"menu_id":   menu.MenuId,
				"menu_name": menu.MenuName,
				"meals":     meals,
			},
		})
	}
}
