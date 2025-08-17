package models

import "time"

type User struct {
	UserId        int       `json:"user_id"`
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
