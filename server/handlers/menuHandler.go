package handlers

import (
	"database/sql"
	"fmt"

	"time"

	"github.com/gin-gonic/gin"
)

type Menu struct {

	Menu_ID   int       `json:"menu_id"`

	User_ID   int       `json:"user_id"`

	MenuName  string    `json:"menu_name"`

	CreatedAt time.Time `json:"created_at"`
	
}

// Função com finalidade de criar um menu.
func (m *Menu) CriarMenu(db *sql.DB) gin.HandlerFunc {

	return func(c *gin.Context) {

		token := c.Request.Header.Get("Authorization")

		userID, err := ValidarOToken(token)

		if err != nil {

			c.JSON(401, gin.H{"message": "Token inválido"})

			return

		}

		var menu Menu

		if err := c.BindJSON(&menu); err != nil {

			c.JSON(400, gin.H{"message": "Erro ao criar menu"})

			fmt.Println(err)

			return

		}

		_, err = db.Exec("INSERT INTO menus (user_id, menu_name, created_at) VALUES ($1, $2, $3)", userID, menu.MenuName, time.Now())		

		if err != nil {

			c.JSON(400, gin.H{"message": "Erro ao criar menu"})

			fmt.Println(err)

			return

		}

		c.JSON(200, gin.H{"message": "Menu criado com sucesso"})

	}

}

// Função para resgatar o único menu do usuário.
func (m *Menu) ResgatarMenu(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Resgata o token do header de autorização
		token := c.Request.Header.Get("Authorization")

		// Valida o token para obter o userID
		userID, err := ValidarOToken(token)
		if err != nil {
			c.JSON(401, gin.H{"message": "Token inválido"})
			return
		}

		// Query para resgatar o único menu do usuário
		var menu Menu
		err = db.QueryRow("SELECT menu_id, user_id, menu_name, created_at FROM menus WHERE user_id = $1", userID).
			Scan(&menu.Menu_ID, &menu.User_ID, &menu.MenuName, &menu.CreatedAt)

		// Verifica erros na consulta
		if err != nil {
			if err == sql.ErrNoRows {
				c.JSON(404, gin.H{"message": "Menu não encontrado"})
			} else {
				c.JSON(400, gin.H{"message": "Erro ao buscar menu"})
				fmt.Println(err)
			}
			return
		}

		// Retorna o menu encontrado
		c.JSON(200, gin.H{"menu": menu})
	}
}


// Função para carregar um menu que seja de um usuário.
func (m *Menu) CarregarMenu(db *sql.DB) gin.HandlerFunc {

	return func(c *gin.Context) {

		token, err := c.Cookie("token")

		if err != nil {

			c.JSON(401, gin.H{"message": "Token inválido"})

			return
			
		}

		userID, err := ValidarOToken(token)

		if err != nil {

			c.JSON(401, gin.H{"message:": "Token inválido"})

			return

		}

		menuID := c.Param("menu_id")

		var menu Menu

		row := db.QueryRow("SELECT menu_id, user_id, menu_name, created_at FROM menus WHERE menu_id = $1 AND user_id = $2", menuID, userID)

		err = row.Scan(&menu.Menu_ID, &menu.User_ID, &menu.MenuName, &menu.CreatedAt)

		if err != nil {

			c.JSON(400, gin.H{"message": "Erro ao carregar menu"})

			return

		}

		c.HTML(200, "menu.html", gin.H{"menu": menu})

}}

// Função para calcular as calorias e quantidade de um menu.
func (m *Menu) CalcularTotalDeCaloriasEQuantidadeDoMenu(db *sql.DB) gin.HandlerFunc {

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

        menuID := c.Param("menu_id")

        var totalCalorias int
        var quantidadeTotal int

        // Busca todas as refeições do menu
        rows, err := db.Query("SELECT meal_id FROM meals WHERE menu_id = $1", menuID)
        if err != nil {
            c.JSON(400, gin.H{"message": "Erro ao buscar refeições no menu"})
            fmt.Println(err)
            return
        }
        defer rows.Close()

        // Calcula calorias e quantidade somando os valores de todas as refeições associadas ao menu
        for rows.Next() {
            var mealID int
            err := rows.Scan(&mealID)
            if err != nil {
                c.JSON(400, gin.H{"message": "Erro ao processar refeições"})
                fmt.Println(err)
                return
            }

            // Busca as calorias e a quantidade de cada refeição
            var mealCalories sql.NullInt64
            var mealQuantity sql.NullInt64
            err = db.QueryRow("SELECT COALESCE(SUM(calories), 0), COALESCE(SUM(quantity), 0) FROM foods WHERE meal_id = $1", mealID).Scan(&mealCalories, &mealQuantity)
            if err != nil {
                c.JSON(400, gin.H{"message": "Erro ao calcular calorias e quantidade da refeição"})
                fmt.Println(err)
                return
            }

            totalCalorias += int(mealCalories.Int64)
            quantidadeTotal += int(mealQuantity.Int64)
        }

        // Caso ocorra erro durante o processo de iteração
        if err = rows.Err(); err != nil {
            c.JSON(500, gin.H{"message": "Erro ao processar refeições no menu"})
            fmt.Println(err)
            return
        }

        c.JSON(200, gin.H{"total_calories": totalCalorias, "total_quantity": quantidadeTotal})
    }
}
