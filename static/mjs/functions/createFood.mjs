import { getCookie } from './getCookie.mjs';

// Função para criar um alimento
function createFood(foodName, calories, quantity, mealId) {

    return fetch('/createFood', {

        method: 'POST',

        headers: {

            'Content-Type': 'application/json',

            'Authorization': getCookie('token')

        },

        body: JSON.stringify({

            meal_id: parseInt(mealId),  

            food_name: foodName,

            calories: parseInt(calories),

            quantity: parseInt(quantity)

        })

    })

    .then(response => response.json())

    .catch(error => console.error('Erro ao criar alimento:', error));

}

export { createFood };