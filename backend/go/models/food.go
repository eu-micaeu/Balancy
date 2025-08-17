package models

type Food struct {
	FoodId   int    `json:"food_id"`
	MealId   int    `json:"meal_id"`
	FoodName string `json:"food_name"`
	Calories int    `json:"calories"`
	Quantity int    `json:"quantity"`
}
