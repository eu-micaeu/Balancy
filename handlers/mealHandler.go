package handlers

import (
	"database/sql"
	"fmt"

	"time"

	"github.com/gin-gonic/gin"
)

type Meal struct {

	Meal_ID   int       `json:"meal_id"`

	Menu_ID   int       `json:"menu_id"`

	MealName  string    `json:"meal_name"`

	CreatedAt time.Time `json:"created_at"`
	
}

// Função com finalidade de criar uma refeição em um menu de um usuário.
func (m *Meal) CriarRefeicao(db *sql.DB) gin.HandlerFunc {

	return func(c *gin.Context) {

		token := c.Request.Header.Get("Authorization")

		_, err := ValidarOToken(token)

		if err != nil {

			c.JSON(401, gin.H{"message": "Token inválido"})

			return

		}

		var meal Meal

		if err := c.BindJSON(&meal); err != nil {

			c.JSON(400, gin.H{"message": "Erro ao criar refeição"})

			fmt.Println(err)

			return

		}

		_, err = db.Exec("INSERT INTO meals (menu_id, meal_name, created_at) VALUES ($1, $2, $3)", meal.Menu_ID, meal.MealName, time.Now())

		if err != nil {

			c.JSON(400, gin.H{"message": "Erro ao criar refeição"})

			fmt.Println(err)

			return

		}

		c.JSON(200, gin.H{"message": "Refeição criada com sucesso"})

	}

}

// Função com finalidade de listar todas as refeições de um menu.
func (m *Meal) ListarRefeicoesDeUmMenu(db *sql.DB) gin.HandlerFunc {

    return func(c *gin.Context) {

        token := c.Request.Header.Get("Authorization")

        _, err := ValidarOToken(token)

        if err != nil {
            c.JSON(401, gin.H{"message": "Token inválido"})
            return
        }

        menuID := c.Param("menu_id")

        rows, err := db.Query("SELECT meal_id, menu_id, meal_name, created_at FROM meals WHERE menu_id = $1", menuID)

        if err != nil {

            c.JSON(400, gin.H{"message": "Erro ao listar refeições"})

            fmt.Println(err)

            return

        }

        var meals []Meal

        for rows.Next() {

            var meal Meal

            rows.Scan(&meal.Meal_ID, &meal.Menu_ID, &meal.MealName, &meal.CreatedAt)

            meals = append(meals, meal)

        }

        c.JSON(200, gin.H{"meals": meals})

    }
	
}

// Função com finalidade de carregar uma refeição.
func (m *Meal) CarregarRefeicao(db *sql.DB) gin.HandlerFunc {

	return func(c *gin.Context) {

		token, err := c.Cookie("token")

		if err != nil {

			c.JSON(401, gin.H{"message": "Token inválido"})

			return
			
		}
		_, err = ValidarOToken(token)

		if err != nil {

			c.JSON(401, gin.H{"message": "Token inválido"})

			return

		}

		var meal Meal

		row := db.QueryRow("SELECT meal_id, menu_id, meal_name, created_at FROM meals WHERE meal_id = $1", c.Param("meal_id"))

		err = row.Scan(&meal.Meal_ID, &meal.Menu_ID, &meal.MealName, &meal.CreatedAt)

		if err != nil {

			c.JSON(400, gin.H{"message": "Erro ao carregar refeição"})

			fmt.Println(err)

			return

		}

		c.HTML(200, "meal.html", gin.H{"meal": meal})

	}

}

// Função com finalidade de calcular o total de calorias e quantidade de uma refeição.
func (m *Meal) CalcularTotalDeCaloriasEQuantidadeDaRefeicao(db *sql.DB) gin.HandlerFunc {
	
	return func(c *gin.Context) {

		token := c.Request.Header.Get("Authorization")

		_, err := ValidarOToken(token)

		if err != nil {

			c.JSON(401, gin.H{"message": "Token inválido"})

			return

		}

		var meal Meal

		row := db.QueryRow("SELECT meal_id, menu_id, meal_name, created_at FROM meals WHERE meal_id = $1", c.Param("meal_id"))

		err = row.Scan(&meal.Meal_ID, &meal.Menu_ID, &meal.MealName, &meal.CreatedAt)

		if err != nil {

			c.JSON(400, gin.H{"message": "Erro ao calcular total de calorias e quantidade de refeições"})

			fmt.Println(err)

			return

		}

		var totalCalories int

		var totalQuantity int

		rows, err := db.Query("SELECT calories, quantity FROM foods WHERE meal_id = $1", c.Param("meal_id"))

		if err != nil {

			c.JSON(400, gin.H{"message": "Erro ao calcular total de calorias e quantidade de refeições"})

			fmt.Println(err)

			return

		}

		for rows.Next() {

			var calories int

			var quantity int

			rows.Scan(&calories, &quantity)

			totalCalories += calories

			totalQuantity += quantity

		}

		c.JSON(200, gin.H{"total_calories": totalCalories, "total_quantity": totalQuantity})

	}

}

// Função com finalidade de deletar uma refeição.
func (m *Meal) DeletarRefeicao(db *sql.DB) gin.HandlerFunc {

	return func(c *gin.Context) {

		token := c.Request.Header.Get("Authorization")

		_, err := ValidarOToken(token)

		if err != nil {

			c.JSON(401, gin.H{"message": "Token inválido"})

			return

		}

		_, err = db.Exec("DELETE FROM meals WHERE meal_id = $1", c.Param("meal_id"))

		if err != nil {

			c.JSON(400, gin.H{"message": "Erro ao deletar refeição"})

			fmt.Println(err)

			return

		}

		c.JSON(200, gin.H{"message": "Refeição deletada com sucesso"})

	}

}