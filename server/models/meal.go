package models

type Meal struct {
	MealId   int    `json:"meal_id"`
	MealName string `json:"meal_name"`
	MenuId   int    `json:"menu_id"`
}
