import { getCookie } from './getCookie.mjs';

// Função para buscar o menu
function fetchMenu() {

    var btAddMeal = document.getElementById('btAddMeal');

    return fetch('/menu', {

        method: 'GET',

        headers: {

            'Content-Type': 'application/json',

            'Authorization': getCookie('token')

        }

    })

    .then(response => {

        if (response.status === 404) {

            btAddMeal.style.display = 'none';

            throw new Error("Menu not found (404)");

        } else if (response.status === 200) {

            document.getElementById('noMenu').style.display = 'none';

            btAddMeal.style.display = 'block';

            return response.json();

        } else {

            throw new Error("Unexpected response status: " + response.status);

        }
    })

    .then(data => {

        if (data && data.menu) {

            localStorage.setItem('menu_id', data.menu.menu_id);

            return data.menu;

        } else {

            throw new Error("No menu available");

        }

    })

    .catch(error => {

        console.error("Error fetching menu:", error);

    });
    
}

export { fetchMenu };