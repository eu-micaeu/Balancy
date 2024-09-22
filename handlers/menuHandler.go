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

// Função para listar menus de um usuário.
func (m *Menu) ListarMenusDeUmUsuario(db *sql.DB) gin.HandlerFunc {

	return func(c *gin.Context) {

		token, err := c.Cookie("token")

		if err != nil {

			c.JSON(400, gin.H{"message": "Erro ao listar menus"})

			return

		}

		user_id, _ := ValidarOToken(token)

		rows, err := db.Query("SELECT menu_id, user_id, menu_name, created_at FROM menus WHERE user_id = $1", user_id)

		if err != nil {

			c.JSON(400, gin.H{"message": "Erro ao listar menus"})

			return

		}

		var menus []Menu

		for rows.Next() {

			var menu Menu

			rows.Scan(&menu.Menu_ID, &menu.User_ID, &menu.MenuName, &menu.CreatedAt)

			menus = append(menus, menu)

		}

		c.JSON(200, menus)

	}

}