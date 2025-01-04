package models

type Menu struct {
	MenuId   int    `json:"menu_id"`
	MenuName string `json:"menu_name"`
	UserId   int    `json:"user_id"`
}
