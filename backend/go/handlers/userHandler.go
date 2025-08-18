package handlers

import (
	"database/sql"
	"fmt"
	"net/http"
	"time"

	"github.com/eu-micaeu/Balancy/server/middlewares"
	"github.com/eu-micaeu/Balancy/server/models"

	"github.com/gin-gonic/gin"
)

type User models.User

// getUserIDFromContext extracts and converts userID from gin context
// JWT claims convert numbers to float64, so this handles the conversion properly
func getUserIDFromContext(c *gin.Context) (int, error) {
	userID, exists := c.Get("userID")
	if !exists {
		return 0, fmt.Errorf("user not authenticated")
	}

	if userIDFloat, ok := userID.(float64); ok {
		return int(userIDFloat), nil
	} else if userIDInt, ok := userID.(int); ok {
		return userIDInt, nil
	}

	return 0, fmt.Errorf("invalid userID type")
}

// Create
func (u *User) Register(db *sql.DB) gin.HandlerFunc {

	return func(c *gin.Context) {

		var user User

		if err := c.ShouldBindJSON(&user); err != nil {

			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

			return

		}

		query := `INSERT INTO users (username, email, password, full_name, gender, age, weight, height, activity_level, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING user_id`

		var user_id int

		err := db.QueryRow(query, user.Username, user.Email, user.Password, user.FullName, user.Gender, user.Age, user.Weight, user.Height, user.ActivityLevel, time.Now()).Scan(&user_id)

		if err != nil {

			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})

			return

		}

		user.UserId = user_id

		c.JSON(http.StatusCreated, user)

	}

}

// Read
func (u *User) Login(db *sql.DB) gin.HandlerFunc {

	return func(c *gin.Context) {

		var user User

		if err := c.ShouldBindJSON(&user); err != nil {

			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

			return

		}

		query := `SELECT user_id, username, email, full_name, gender, age, weight, height, activity_level, created_at FROM users WHERE username = $1 AND password = $2`

		err := db.QueryRow(query, user.Username, user.Password).Scan(&user.UserId, &user.Username, &user.Email, &user.FullName, &user.Gender, &user.Age, &user.Weight, &user.Height, &user.ActivityLevel, &user.CreatedAt)

		if err != nil {

			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})

			return

		}

		token, err := middlewares.GerarToken(user.UserId)

		if err != nil {

			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})

			return

		}

		c.JSON(http.StatusOK, gin.H{

			"message": "Usuário logado com sucesso",

			"token": token,
		})

	}

}

// Update
func (u *User) Update(db *sql.DB) gin.HandlerFunc {

	return func(c *gin.Context) {

		// Recuperar userID do contexto (definido pelo AuthMiddleware)
		userID, err := getUserIDFromContext(c)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}

		var user User

		if err := c.ShouldBindJSON(&user); err != nil {

			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})

			return

		}

		// Usar o userID do contexto em vez do JSON
		query := `UPDATE users SET username = $1, email = $2, password = $3, full_name = $4, gender = $5, age = $6, weight = $7, height = $8, activity_level = $9 WHERE user_id = $10`

		_, err = db.Exec(query, user.Username, user.Email, user.Password, user.FullName, user.Gender, user.Age, user.Weight, user.Height, user.ActivityLevel, userID)

		if err != nil {

			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})

			return

		}

		// Definir o user_id no objeto de resposta
		user.UserId = userID

		c.JSON(http.StatusOK, user)

	}

}

// GetProfile retorna os dados do usuário autenticado (obtém userID do contexto)
func (u *User) GetProfile(db *sql.DB) gin.HandlerFunc {
	return func(c *gin.Context) {
		// Recuperar userID do contexto (definido pelo AuthMiddleware)
		userID, err := getUserIDFromContext(c)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
			return
		}

		var user User
		query := `SELECT user_id, username, email, full_name, gender, age, weight, height, activity_level, created_at FROM users WHERE user_id = $1`
		err = db.QueryRow(query, userID).Scan(&user.UserId, &user.Username, &user.Email, &user.FullName, &user.Gender, &user.Age, &user.Weight, &user.Height, &user.ActivityLevel, &user.CreatedAt)
		if err != nil {
			if err == sql.ErrNoRows {
				c.JSON(http.StatusNotFound, gin.H{"error": "Usuário não encontrado"})
				return
			}
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusOK, user)
	}
}
