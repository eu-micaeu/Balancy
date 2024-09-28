import { getCookie } from './getCookie.mjs';
import { closeOverlay } from './closeOverlay.mjs';

// Função para criar uma refeição
function createMeal(mealName) {

    return fetch('/createMeal', {

        method: 'POST',

        headers: {

            'Content-Type': 'application/json',

            'Authorization': getCookie('token')

        },

        body: JSON.stringify({

            menu_id: parseInt(localStorage.getItem('menu_id')),

            meal_name: mealName

        })

    })

    .then(response => response.json())

    .then(data => {
        
        if (data.status === 'success') {

            closeOverlay('popUpCreateMeal'); 

        }

    });
    
}

export { createMeal };