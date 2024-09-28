import { getCookie } from './getCookie.mjs';
import { closeOverlay } from './closeOverlay.mjs';

// Função para criar um alimento
function createFood(foodName, calories, quantity, mealId) {
    return fetch('/createFood', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': getCookie('token')
        },
        body: JSON.stringify({
            meal_id: parseInt(mealId),  // Usa o meal_id recuperado do localStorage
            food_name: foodName,
            calories: parseInt(calories),
            quantity: parseInt(quantity)
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            closeOverlay('popUpCreateFood'); // Fechar o overlay ao criar o alimento
        } else {
            console.error('Erro ao criar alimento:', data);
        }
    })
    .catch(error => console.error('Erro ao criar alimento:', error));
}

export { createFood };