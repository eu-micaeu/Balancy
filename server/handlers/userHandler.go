package handlers

import (
	"database/sql"
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

type User struct {
	User_ID       int       `json:"user_id"`
	Username      string    `json:"username"`
	Email         string    `json:"email"`
	Password      string    `json:"password"`
	FullName      string    `json:"full_name"`
	Gender        string    `json:"gender"`
	Age           int       `json:"age"`
	Weight        float64   `json:"weight"`
	Height        float64   `json:"height"`
	ActivityLevel string    `json:"activity_level"`
	CreatedAt     time.Time `json:"created_at"`
}

// Função para logar o usuário
func (u *User) Entrar(db *sql.DB) gin.HandlerFunc {

	return func(c *gin.Context) {

		var user User

		if err := c.BindJSON(&user); err != nil {

			c.JSON(400, gin.H{"message": "Erro ao fazer login"})

			return

		}

		row := db.QueryRow("SELECT user_id, username, password FROM users WHERE username = $1 AND password = $2", user.Username, user.Password)

		err := row.Scan(&user.User_ID, &user.Username, &user.Password)

		if err != nil {

			c.JSON(404, gin.H{"message": "Usuário ou senha incorretos"})

			return

		}

		token, err := GerarOToken(user)

		if err != nil {
			c.JSON(500, gin.H{"message": "Erro ao gerar token"})
			return
		}

		cookie := &http.Cookie{

			Name: "token",

			Value: token,

			Expires: time.Now().Add(72 * time.Hour),

			HttpOnly: false,

			Secure: false,

			SameSite: http.SameSiteStrictMode,

			Path: "/",
		}

		http.SetCookie(c.Writer, cookie)

		c.JSON(200, gin.H{"message": "Login efetuado com sucesso!", "token": token})

	}

}

// Função para registrar o usuário
func (u *User) Registrar(db *sql.DB) gin.HandlerFunc {

	return func(c *gin.Context) {

		var newUser User

		if err := c.BindJSON(&newUser); err != nil {

			fmt.Println(err)

			c.JSON(400, gin.H{"message": "Erro ao criar usuário"})

			return

		}

		_, err := db.Exec(`
            INSERT INTO users (username, email, password, full_name, gender, age, weight, height, activity_level, created_at) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
			newUser.Username, newUser.Email, newUser.Password, newUser.FullName,
			newUser.Gender,newUser.Age, newUser.Weight, newUser.Height, newUser.ActivityLevel, time.Now())

		if err != nil {

			fmt.Println(err)

			c.JSON(500, gin.H{"message": "Erro ao criar usuário"})

			return

		}

		c.JSON(200, gin.H{"message": "Usuário criado com sucesso!"})

	}

}

// Função para resgatar informações do usuário
func (u *User) Resgatar(db *sql.DB) gin.HandlerFunc {

	return func(c *gin.Context) {

		token, err := c.Cookie("token")

		if err != nil {

			c.JSON(401, gin.H{"message": "Token não encontrado"})

			return

		}

		userID, err := ValidarOToken(token)

		if err != nil {

			c.JSON(401, gin.H{"message": "Token inválido"})

			return

		}

		row := db.QueryRow(`
            SELECT user_id, username, email, full_name, gender, age, weight, height, activity_level, created_at 
            FROM users WHERE user_id = $1`, userID)

		err = row.Scan(&u.User_ID, &u.Username, &u.Email, &u.FullName, &u.Gender, &u.Age, &u.Weight, &u.Height, &u.ActivityLevel, &u.CreatedAt)

		if err != nil {

			c.JSON(404, gin.H{"message": "Usuário não encontrado"})

			return

		}

		c.JSON(200, u)

	}

}

// Função para deletar o usuário
func (u *User) Deletar(db *sql.DB) gin.HandlerFunc {

	return func(c *gin.Context) {

		token := c.Request.Header.Get("Authorization")

		userID, err := ValidarOToken(token)

		if err != nil {

			c.JSON(401, gin.H{"message": "Token inválido"})

			return

		}

		_, err = db.Exec("DELETE FROM users WHERE user_id = $1", userID)

		if err != nil {

			c.JSON(404, gin.H{"message": "Usuário não encontrado"})

			return

		}

		cookie := &http.Cookie{

			Name: "token",

			Value: "",

			Expires: time.Unix(0, 0),

			HttpOnly: true,

			Secure: true,

			SameSite: http.SameSiteStrictMode,
		}

		http.SetCookie(c.Writer, cookie)

		c.JSON(200, gin.H{"message": "Usuário deletado com sucesso!"})

	}

}

// Função para calcular o IMC
func (u *User) CalcularIMC(db *sql.DB) gin.HandlerFunc {

    return func(c *gin.Context) {
		
        var input struct {
            Weight float64 `json:"weight"` 
            Height float64 `json:"height"`
        }

        if err := c.ShouldBindJSON(&input); err != nil {
            c.JSON(400, gin.H{"error": "Dados inválidos"})
            return
        }

        weight := input.Weight
        height := input.Height

        imc := weight / (height * height)

        c.JSON(200, gin.H{"message": "IMC calculado com sucesso!", "imc": imc})
    }
}

// Função para calcular o TDEE
func (u *User) CalcularTDEE(db *sql.DB) gin.HandlerFunc {
	
	return func(c *gin.Context) {

		var input struct {
			Weight        float64 `json:"weight"`      
			Height        float64 `json:"height"`       
			Age           int     `json:"age"`          
			Gender        string  `json:"gender"`        
			ActivityLevel string  `json:"activity_level"`
		}

		if err := c.ShouldBindJSON(&input); err != nil {
			c.JSON(400, gin.H{"error": "Dados inválidos"})
			return
		}

		weight := input.Weight
		height := input.Height * 100
		age := input.Age
		gender := input.Gender
		activityLevel := input.ActivityLevel

		var tmb float64

		if gender == "M" {
			tmb = 10*weight + 6.25*height - 5*float64(age) + 5 
		} else if gender == "F" {
			tmb = 10*weight + 6.25*height - 5*float64(age) - 161 
		} else {
			c.JSON(400, gin.H{"error": "Gênero inválido"})
			return
		}

		var activityMultiplier float64

		switch activityLevel {
		case "sedentary":
			activityMultiplier = 1.2 
		case "light":
			activityMultiplier = 1.375 
		case "moderate":
			activityMultiplier = 1.55 
		case "active":
			activityMultiplier = 1.725 
		case "very_active":
			activityMultiplier = 1.9 
		default:
			c.JSON(400, gin.H{"error": "Nível de atividade inválido"})
			return
		}

		tdee := tmb * activityMultiplier

		c.JSON(200, gin.H{
			"message": "TDEE calculado com sucesso!",
			"tdee":    tdee,
		})
	}
}
